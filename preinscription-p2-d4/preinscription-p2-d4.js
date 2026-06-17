/* ============================================================
   PRÉINSCRIPTION-P2-D4.JS — Pré-inscription étudiants P2 → D4 (Antilles-Guyane)
   Pattern « pré-inscription » (compte d'abord, accès bloqué) :
   - signUp Supabase avec is_preinscription:true → le trigger handle_new_user
     pose le rôle verrouillé etudiant_preinscrit (aucun accès plateforme).
   - Puis insertion de la ligne dans preinscriptions_p2_d4 (RLS self-insert).
   - Aucun paiement. Redirection vers la page de confirmation.
   ============================================================ */

// ─── Appliquer la config (branding) ───
document.title = 'Pré-inscription P2-D4 — ' + APP_CONFIG.brandName;
document.getElementById('logoImg').src = APP_CONFIG.logoUrl;
document.getElementById('logoImg').alt = APP_CONFIG.brandName;
document.getElementById('brandPart1').textContent = APP_CONFIG.brandPart1;
document.getElementById('brandPart2').textContent = APP_CONFIG.brandPart2;
document.getElementById('year').textContent = APP_CONFIG.year;
document.getElementById('footer').textContent = APP_CONFIG.copyright;

// ─── Client Supabase ───
const sb = window.supabase.createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabaseAnonKey);

// Niveaux concernés (externat) et facultés Antilles-Guyane.
const NIVEAUX_CODES = ['P2', 'D1', 'D2', 'D3', 'D4'];
const FACULTES_CODES = ['Guadeloupe', 'Martinique', 'Guyane'];

let niveauById = new Map();      // id -> { code, libelle }
let departementById = new Map(); // id -> { code, libelle }

// ─── Messages ───
function showMsg(type, text) {
  const el = document.getElementById('msg');
  el.className = 'msg show ' + type;
  el.textContent = text;
}

function togglePasswordVisibility() {
  const input = document.getElementById('mdp');
  input.type = input.type === 'password' ? 'text' : 'password';
}

// ─── Charger niveaux + facultés (source : base, jamais d'id en dur) ───
async function loadDonnees() {
  try {
    const [niveauxRes, deptRes] = await Promise.all([
      sb.from('niveaux').select('id, code, libelle, ordre').in('code', NIVEAUX_CODES).order('ordre'),
      sb.from('departements').select('id, code, libelle').in('code', FACULTES_CODES).order('id')
    ]);

    const selNiveau = document.getElementById('niveau');
    selNiveau.innerHTML = '<option value="">— Choisir —</option>';
    (niveauxRes.data || []).forEach(n => {
      niveauById.set(String(n.id), n);
      const opt = document.createElement('option');
      opt.value = n.id;
      opt.textContent = n.libelle;
      selNiveau.appendChild(opt);
    });

    const selFac = document.getElementById('faculte');
    selFac.innerHTML = '<option value="">— Choisir —</option>';
    (deptRes.data || []).forEach(d => {
      departementById.set(String(d.id), d);
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = d.libelle;
      selFac.appendChild(opt);
    });
  } catch (e) {
    console.error('Erreur chargement données :', e);
    showMsg('error', 'Erreur de chargement du formulaire. Recharge la page.');
  }
}

// ─── Soumission ───
document.getElementById('preinscriptionForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('btnSubmit');
  document.getElementById('msg').className = 'msg';

  const civilite = document.getElementById('civilite').value;
  const niveauId = document.getElementById('niveau').value;
  const faculteId = document.getElementById('faculte').value;
  const prenom = document.getElementById('prenom').value.trim();
  const nom = document.getElementById('nom').value.trim().toUpperCase();
  const indicatif = document.getElementById('indicatif').value;
  const telNum = document.getElementById('telephone').value.trim();
  const telephone = indicatif + telNum;
  const email = document.getElementById('email').value.trim().toLowerCase();
  const mdp = document.getElementById('mdp').value;

  if (!civilite || !niveauId || !faculteId || !prenom || !nom || !telNum) {
    showMsg('error', 'Merci de remplir tous les champs obligatoires.');
    return;
  }
  if (!email || email.indexOf('@') < 1 || email.indexOf('.') === -1) {
    showMsg('error', 'Merci de saisir une adresse e-mail valide.');
    return;
  }
  if (!mdp || mdp.length < 6) {
    showMsg('error', 'Le mot de passe doit faire au moins 6 caractères.');
    return;
  }

  const niveau = niveauById.get(String(niveauId));
  const dept = departementById.get(String(faculteId));
  if (!niveau || !dept) {
    showMsg('error', 'Niveau ou faculté invalide. Recharge la page.');
    return;
  }

  btn.disabled = true;
  btn.textContent = '⏳ Création en cours...';

  try {
    // 1) Création du compte VERROUILLÉ (le trigger handle_new_user pose
    //    le rôle etudiant_preinscrit via le flag is_preinscription).
    const { data: authData, error: authError } = await sb.auth.signUp({
      email: email,
      password: mdp,
      options: {
        data: {
          civilite: civilite,
          prenom: prenom,
          nom: nom,
          telephone: telephone,
          email_personnel: email,
          niveau: niveau.code,          // P2 / D1 / D2 / D3 / D4
          departement: dept.code,       // Guadeloupe / Martinique / Guyane
          is_preinscription: true       // → rôle etudiant_preinscrit (compte bloqué)
        }
      }
    });

    if (authError) {
      if ((authError.message || '').includes('already registered')) {
        showMsg('error', 'Cet e-mail est déjà utilisé. Si tu t\'es déjà pré-inscrit·e, contacte-nous.');
      } else {
        showMsg('error', 'Erreur : ' + authError.message);
      }
      btn.disabled = false;
      btn.textContent = 'Je me pré-inscris';
      return;
    }

    const userId = authData.user ? authData.user.id : null;
    if (!userId) {
      showMsg('error', 'Compte créé mais session indisponible. Contacte-nous.');
      btn.disabled = false;
      btn.textContent = 'Je me pré-inscris';
      return;
    }

    // 2) Enregistrer la pré-inscription (RLS : self-insert authentifié).
    const { error: preError } = await sb.from('preinscriptions_p2_d4').insert({
      user_id: userId,
      prenom: prenom,
      nom: nom,
      email: email,
      telephone: telephone,
      niveau_id: parseInt(niveauId, 10),
      departement_etudes_id: parseInt(faculteId, 10),
      statut: 'preinscrit',
      source: 'formulaire_p2_d4'
    });

    if (preError) {
      console.error('Erreur enregistrement pré-inscription :', preError);
      showMsg('error', 'Compte créé, mais l\'enregistrement de la pré-inscription a échoué. Contacte-nous.');
      btn.disabled = false;
      btn.textContent = 'Je me pré-inscris';
      return;
    }

    // 3) Confirmation (pas de paiement, pas de re-login).
    showMsg('success', 'Pré-inscription enregistrée ! Redirection...');
    btn.textContent = 'C\'est fait !';
    setTimeout(() => { window.location.href = 'merci.html'; }, 1000);

  } catch (err) {
    console.error(err);
    showMsg('error', 'Erreur : ' + (err.message || err));
    btn.disabled = false;
    btn.textContent = 'Je me pré-inscris';
  }
});

// ─── Init ───
loadDonnees();
