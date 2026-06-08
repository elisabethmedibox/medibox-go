/* ============================================================
   INSCRIPTION-2026.JS — Inscription PASS-LAS 2026-2027
   - Universités limitées (ouvert_inscription_pass_las)
   - Niveaux PASS/LAS, année figée à config.year
   - Champs formule + département d'études + référents (parents)
   - Crée un compte verrouillé (rôle etudiant_preinscrit via le
     flag is_preinscription du trigger handle_new_user)
   - Enregistre le dossier dans inscriptions_pass_las + référents
   - Redirige vers la page de paiement des frais d'inscription
   ============================================================ */

// ─── Appliquer la config ───
document.title = 'Inscription PASS-LAS — ' + APP_CONFIG.brandName;
document.getElementById('logoImg').src = APP_CONFIG.logoUrl;
document.getElementById('logoImg').alt = APP_CONFIG.brandName;
document.getElementById('brandPart1').textContent = APP_CONFIG.brandPart1;
document.getElementById('brandPart2').textContent = APP_CONFIG.brandPart2;
document.getElementById('year').textContent = APP_CONFIG.year;
document.getElementById('footer').textContent = APP_CONFIG.copyright;

// ─── Client Supabase ───
const sb = window.supabase.createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabaseAnonKey);

// ─── État partagé ───
let universitesById = new Map();
let departementsByCode = new Map();
let anneeEtudeId = null;

// ─── Helper : remplir un <select> ───
function fillSelect(selectId, items, valueField, labelFn, placeholder) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = '<option value="">' + placeholder + '</option>';
  items.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item[valueField];
    opt.textContent = labelFn(item);
    sel.appendChild(opt);
  });
}

// ─── Charger les listes de référence ───
async function loadDonnees() {
  const selUniv = document.getElementById('universite');
  try {
    const [universitesRes, niveauxRes, departementsRes, formulesRes, anneesRes] = await Promise.all([
      sb.from('universites').select('id, nom, ville, domaine_email')
        .eq('ouvert_inscription_pass_las', true).order('nom'),
      sb.from('niveaux').select('code, libelle, ordre')
        .eq('actif', true).eq('categorie', 'pre-medecine').order('ordre'),
      sb.from('departements').select('id, code, libelle')
        .eq('actif', true).neq('code', 'Métropole').order('libelle'),
      sb.from('formules').select('id, code, libelle, ordre')
        .eq('actif', true).neq('code', 'Externe').order('ordre'),
      sb.from('annees_etude').select('id, libelle').eq('libelle', APP_CONFIG.year).maybeSingle()
    ]);

    const universites = universitesRes.data || [];
    const niveaux = niveauxRes.data || [];
    const departements = departementsRes.data || [];
    const formules = formulesRes.data || [];
    anneeEtudeId = anneesRes.data ? anneesRes.data.id : null;

    // Universités (nom seul, les 2 facs sont explicites)
    selUniv.innerHTML = '<option value="">— Choisir votre université —</option>';
    universites.forEach(u => {
      universitesById.set(String(u.id), u);
      const opt = document.createElement('option');
      opt.value = u.id;
      opt.textContent = u.nom;
      selUniv.appendChild(opt);
    });

    // Niveaux PASS/LAS
    fillSelect('niveau', niveaux, 'code', n => n.libelle, '— Choisir —');

    // Départements d'études (3 antillais, ordre alphabétique)
    departements.forEach(d => departementsByCode.set(d.code, d));
    fillSelect('departementEtudes', departements, 'code', d => d.libelle, '— Choisir —');

    // Formules (hors Externe)
    fillSelect('formule', formules, 'id', f => f.libelle, '— Choisir —');
  } catch (e) {
    selUniv.innerHTML = '<option value="">Erreur de chargement</option>';
    console.error('Erreur chargement données :', e);
  }
}

// ─── Affichage conditionnel des référents ───
document.getElementById('financeParProche').addEventListener('change', (e) => {
  document.getElementById('parentsSection').style.display = (e.target.value === 'oui') ? 'block' : 'none';
});
document.getElementById('btnAjouterRef2').addEventListener('click', () => {
  document.getElementById('parent2Section').style.display = 'block';
  document.getElementById('btnAjouterRef2').style.display = 'none';
});

// ─── Messages ───
function showMsg(type, text) {
  const el = document.getElementById('msg');
  el.className = 'msg show ' + type;
  el.textContent = text;
}

// ─── Construire la liste des référents à enregistrer ───
function collectReferents() {
  const refs = [];
  [1, 2].forEach(rang => {
    const civ = document.getElementById('ref' + rang + 'Civilite').value;
    const prenom = document.getElementById('ref' + rang + 'Prenom').value.trim();
    const nom = document.getElementById('ref' + rang + 'Nom').value.trim().toUpperCase();
    const emailRef = document.getElementById('ref' + rang + 'Email').value.trim().toLowerCase();
    const indicatif = document.getElementById('ref' + rang + 'Indicatif').value;
    const telNum = document.getElementById('ref' + rang + 'Telephone').value.trim();
    const payeur = document.getElementById('ref' + rang + 'Payeur').checked;
    // On n'enregistre le référent que si au moins un champ utile est rempli
    if (prenom || nom || emailRef || telNum) {
      refs.push({
        rang: rang,
        civilite: civ || null,
        prenom: prenom || null,
        nom: nom || null,
        email: emailRef || null,
        telephone: telNum ? (indicatif + telNum) : null,
        est_payeur: payeur
      });
    }
  });
  return refs;
}

// ─── Inscription ───
document.getElementById('inscriptionForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('btnSubmit');
  btn.disabled = true;
  btn.textContent = '⏳ Création en cours...';
  document.getElementById('msg').className = 'msg';

  const email = document.getElementById('email').value.trim().toLowerCase();
  const mdp = document.getElementById('mdp').value;
  const nom = document.getElementById('nom').value.trim().toUpperCase();
  const prenom = document.getElementById('prenom').value.trim();
  const civilite = document.getElementById('civilite').value;
  const niveau = document.getElementById('niveau').value;
  const universiteId = document.getElementById('universite').value;
  const indicatif = document.getElementById('indicatif').value;
  const telNum = document.getElementById('telephone').value.trim();
  const telephone = indicatif + telNum;
  const dateNaissance = document.getElementById('dateNaissance').value;
  const rue = document.getElementById('rue').value.trim();
  const codePostal = document.getElementById('codePostal').value.trim();
  const ville = document.getElementById('ville').value.trim().toUpperCase();
  const departementCode = document.getElementById('departementEtudes').value;
  const formuleId = parseInt(document.getElementById('formule').value, 10);
  const financeParProche = document.getElementById('financeParProche').value === 'oui';

  // Validation basique de l'email (email personnel : Gmail/Yahoo acceptés)
  if (!email || email.indexOf('@') === -1) {
    showMsg('error', 'Merci de saisir une adresse email valide.');
    document.getElementById('email').classList.add('error');
    btn.disabled = false;
    btn.textContent = 'Créer mon compte';
    return;
  }

  const dep = departementsByCode.get(departementCode) || null;
  if (!dep) {
    showMsg('error', 'Merci de choisir ton département d\'études.');
    btn.disabled = false;
    btn.textContent = 'Créer mon compte';
    return;
  }

  try {
    const { data: authData, error: authError } = await sb.auth.signUp({
      email: email,
      password: mdp,
      options: {
        data: {
          civilite: civilite,
          prenom: prenom,
          nom: nom,
          date_naissance: dateNaissance || null,
          telephone: telephone,
          rue: rue || null,
          code_postal: codePostal || null,
          ville: ville || null,
          universite_id: universiteId || null,
          niveau: niveau || null,
          annee_etude: APP_CONFIG.year,
          departement: departementCode,
          email_personnel: email,
          // Flag clé : le trigger assigne le rôle verrouillé etudiant_preinscrit
          is_preinscription: true
        }
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        showMsg('error', 'Cet email est déjà utilisé. Si tu t\'es déjà inscrit, contacte la direction.');
      } else {
        showMsg('error', 'Erreur : ' + authError.message);
      }
      btn.disabled = false;
      btn.textContent = 'Créer mon compte';
      return;
    }

    const userId = authData.user ? authData.user.id : null;
    if (!userId) {
      showMsg('error', 'Compte créé mais session indisponible. Contacte la direction.');
      btn.disabled = false;
      btn.textContent = 'Créer mon compte';
      return;
    }

    // Dossier d'inscription (statut en attente de paiement)
    const { data: inscription, error: inscriptionError } = await sb.from('inscriptions_pass_las')
      .insert({
        user_id: userId,
        annee_etude_id: anneeEtudeId,
        formule_id: formuleId || null,
        departement_etudes_id: dep.id,
        est_finance_par_proche: financeParProche,
        statut_paiement: 'en_attente_paiement',
        source: 'formulaire',
        nom: nom,
        prenom: prenom,
        email: email,
        telephone: telephone
      })
      .select('id')
      .single();

    if (inscriptionError) {
      console.error('Erreur enregistrement inscription :', inscriptionError);
      showMsg('error', 'Compte créé, mais l\'enregistrement du dossier a échoué. Contacte la direction.');
      btn.disabled = false;
      btn.textContent = 'Créer mon compte';
      return;
    }

    // Référents (parents) facultatifs
    const referents = collectReferents();
    if (referents.length > 0) {
      const rows = referents.map(r => ({ inscription_id: inscription.id, ...r }));
      const { error: refError } = await sb.from('inscriptions_referents').insert(rows);
      if (refError) console.warn('Référents non enregistrés :', refError);
    }

    // Redirection vers la page de paiement (la session reste active, le rôle
    // etudiant_preinscrit n'a aucun accès aux données via RLS)
    showMsg('success', 'Compte créé ! Redirection vers le paiement...');
    btn.textContent = 'Compte créé !';
    setTimeout(() => {
      window.location.href = 'merci-inscription-2026.html';
    }, 1200);

  } catch (err) {
    showMsg('error', 'Erreur : ' + err.message);
    btn.disabled = false;
    btn.textContent = 'Créer mon compte';
  }
});

// ─── Nettoyer les erreurs au focus ───
document.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('focus', () => el.classList.remove('error'));
});

// ─── Toggle mot de passe ───
function togglePasswordVisibility() {
  const input = document.getElementById('mdp');
  input.type = input.type === 'password' ? 'text' : 'password';
}

// ─── Init ───
loadDonnees();
