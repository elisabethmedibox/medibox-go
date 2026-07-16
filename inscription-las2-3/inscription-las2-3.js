/* ============================================================
   INSCRIPTION-LAS2-3.JS — Inscription LAS2/LAS3 2026-2027
   - Universités limitées (ouvert_inscription_pass_las)
   - Niveaux LAS2/LAS3 uniquement, année figée à config.year
   - Email universitaire = identifiant de connexion (domaine validé)
     + email personnel obligatoire (profils.email_personnel)
   - Licence (majeure) depuis mineures_pass_las, filtrée par département
   - UE restant à valider (hors UE1/UE3/UE10/UE12 et Oral)
     → table inscriptions_ues_manquantes
   - Formule imposée : MediLAS+
   - Crée un compte verrouillé (rôle etudiant_preinscrit via le
     flag is_preinscription du trigger handle_new_user)
   - Enregistre le dossier dans inscriptions_pass_las + référents
   - Redirige vers la page de paiement des frais d'inscription
   ============================================================ */

// ─── Appliquer la config ───
document.title = 'Inscription LAS2-LAS3 — ' + APP_CONFIG.brandName;
document.getElementById('logoImg').src = APP_CONFIG.logoUrl;
document.getElementById('logoImg').alt = APP_CONFIG.brandName;
document.getElementById('brandPart1').textContent = APP_CONFIG.brandPart1;
document.getElementById('brandPart2').textContent = APP_CONFIG.brandPart2;
document.getElementById('year').textContent = APP_CONFIG.year;
document.getElementById('footer').textContent = APP_CONFIG.copyright;

// ─── Client Supabase ───
const sb = window.supabase.createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabaseAnonKey);

// ─── Constantes métier ───
const UES_EXCLUES = ['UE1', 'UE3', 'UE10', 'UE12', 'ORAL']; // UE disparues en LAS2-3 + Oral
const CODE_FORMULE = 'MediLAS+'; // formule imposée pour les LAS2/LAS3

// ─── État partagé ───
let universitesById = new Map();
let departementsByCode = new Map();
let mineuresParDepartement = new Map(); // departement_id -> [mineures]
let anneeEtudeId = null;
let formuleLasId = null;

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
    const [universitesRes, niveauxRes, departementsRes, mineuresRes, uesRes, formuleRes, anneesRes] = await Promise.all([
      sb.from('universites').select('id, nom, ville, domaine_email')
        .eq('ouvert_inscription_pass_las', true).order('nom'),
      sb.from('niveaux').select('code, libelle, ordre')
        .eq('actif', true).in('code', ['LAS2', 'LAS3']).order('ordre'),
      sb.from('departements').select('id, code, libelle')
        .eq('actif', true).neq('code', 'Métropole').order('libelle'),
      sb.from('mineures_pass_las').select('id, nom, departement_id')
        .eq('actif', true).order('ordre'),
      sb.from('ue_ag_pass_las').select('id, code, nom, ordre').order('ordre'),
      sb.from('formules').select('id').eq('code', CODE_FORMULE).maybeSingle(),
      sb.from('annees_etude').select('id, libelle').eq('libelle', APP_CONFIG.year).maybeSingle()
    ]);

    const universites = universitesRes.data || [];
    const niveaux = niveauxRes.data || [];
    const departements = departementsRes.data || [];
    const mineures = mineuresRes.data || [];
    const ues = (uesRes.data || []).filter(u => UES_EXCLUES.indexOf(u.code) === -1);
    formuleLasId = formuleRes.data ? formuleRes.data.id : null;
    anneeEtudeId = anneesRes.data ? anneesRes.data.id : null;

    // Universités
    selUniv.innerHTML = '<option value="">— Choisir votre université —</option>';
    universites.forEach(u => {
      universitesById.set(String(u.id), u);
      const opt = document.createElement('option');
      opt.value = u.id;
      opt.textContent = u.nom;
      selUniv.appendChild(opt);
    });

    // Niveaux LAS2/LAS3
    fillSelect('niveau', niveaux, 'code', n => n.libelle, '— Choisir —');

    // Départements d'études
    departements.forEach(d => departementsByCode.set(d.code, d));
    fillSelect('departementEtudes', departements, 'code', d => d.libelle, '— Choisir —');

    // Licences (mineures) groupées par département
    mineures.forEach(m => {
      if (!mineuresParDepartement.has(m.departement_id)) mineuresParDepartement.set(m.departement_id, []);
      mineuresParDepartement.get(m.departement_id).push(m);
    });

    // Grille des UE restant à valider
    const grid = document.getElementById('ueGrid');
    grid.innerHTML = '';
    ues.forEach(ue => {
      const label = document.createElement('label');
      label.className = 'spe-checkbox';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'ue-checkbox';
      cb.value = ue.id;
      const span = document.createElement('span');
      span.className = 'spe-label';
      span.textContent = ue.code + ' · ' + ue.nom;
      label.appendChild(cb);
      label.appendChild(span);
      grid.appendChild(label);
    });
  } catch (e) {
    selUniv.innerHTML = '<option value="">Erreur de chargement</option>';
    console.error('Erreur chargement données :', e);
  }
}

// ─── Licences selon le département choisi ───
document.getElementById('departementEtudes').addEventListener('change', (e) => {
  const selLicence = document.getElementById('licence');
  const dep = departementsByCode.get(e.target.value) || null;
  const liste = dep ? (mineuresParDepartement.get(dep.id) || []) : [];
  if (!dep || liste.length === 0) {
    selLicence.disabled = true;
    selLicence.innerHTML = '<option value="">— Choisis d\'abord ton département —</option>';
    return;
  }
  selLicence.disabled = false;
  fillSelect('licence', liste, 'id', m => m.nom, '— Choisir ta licence —');
});

// ─── Indice de domaine selon l'université choisie ───
document.getElementById('universite').addEventListener('change', (e) => {
  const univ = universitesById.get(e.target.value) || null;
  const hint = document.getElementById('emailFacHint');
  if (univ && univ.domaine_email) {
    hint.textContent = 'Cet email te servira d\'identifiant de connexion. Il doit finir par @' + univ.domaine_email + '.';
  } else {
    hint.textContent = 'Cet email universitaire te servira d\'identifiant de connexion.';
  }
});

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

// ─── UE cochées ───
function collectUesManquantes() {
  return Array.from(document.querySelectorAll('.ue-checkbox:checked'))
    .map(cb => parseInt(cb.value, 10))
    .filter(v => !isNaN(v));
}

// ─── Inscription ───
document.getElementById('inscriptionForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('btnSubmit');
  btn.disabled = true;
  btn.textContent = '⏳ Création en cours...';
  document.getElementById('msg').className = 'msg';

  function echec(message, champId) {
    showMsg('error', message);
    if (champId) document.getElementById(champId).classList.add('error');
    btn.disabled = false;
    btn.textContent = 'Créer mon compte';
  }

  const emailFac = document.getElementById('emailFac').value.trim().toLowerCase();
  const emailPerso = document.getElementById('emailPerso').value.trim().toLowerCase();
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
  const mineureId = parseInt(document.getElementById('licence').value, 10);
  const financeParProche = document.getElementById('financeParProche').value === 'oui';

  // Université + email universitaire (identifiant de connexion)
  const universite = universitesById.get(universiteId) || null;
  if (!universite) return echec('Merci de choisir ton université.', 'universite');

  const verifFac = window.AuthValidation.validateEmailUniv(emailFac, universite, null);
  if (!verifFac.valid) return echec(verifFac.error, 'emailFac');

  // Email personnel : valide et différent de l'email universitaire
  if (!emailPerso || emailPerso.indexOf('@') === -1) {
    return echec('Merci de saisir un email personnel valide.', 'emailPerso');
  }
  if (emailPerso === emailFac) {
    return echec('Ton email personnel doit être différent de ton email universitaire.', 'emailPerso');
  }

  const dep = departementsByCode.get(departementCode) || null;
  if (!dep) return echec('Merci de choisir ton département d\'études.', 'departementEtudes');

  if (isNaN(mineureId)) return echec('Merci de choisir ta licence.', 'licence');

  if (!formuleLasId) {
    return echec('La formule MediLAS+ est introuvable. Réessaie plus tard ou contacte la direction.');
  }

  try {
    const { data: authData, error: authError } = await sb.auth.signUp({
      email: emailFac,
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
          email_personnel: emailPerso,
          mineure_id: mineureId,
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
      return echec('Compte créé mais session indisponible. Contacte la direction.');
    }

    // Dossier d'inscription (statut en attente de paiement, formule MediLAS+ imposée)
    const { data: inscription, error: inscriptionError } = await sb.from('inscriptions_pass_las')
      .insert({
        user_id: userId,
        annee_etude_id: anneeEtudeId,
        formule_id: formuleLasId,
        departement_etudes_id: dep.id,
        est_finance_par_proche: financeParProche,
        statut_paiement: 'en_attente_paiement',
        source: 'formulaire',
        nom: nom,
        prenom: prenom,
        email: emailFac,
        telephone: telephone
      })
      .select('id')
      .single();

    if (inscriptionError) {
      console.error('Erreur enregistrement inscription :', inscriptionError);
      return echec('Compte créé, mais l\'enregistrement du dossier a échoué. Contacte la direction.');
    }

    // UE restant à valider (déclaratif)
    const uesManquantes = collectUesManquantes();
    if (uesManquantes.length > 0) {
      const rows = uesManquantes.map(ueId => ({ inscription_id: inscription.id, ue_id: ueId }));
      const { error: ueError } = await sb.from('inscriptions_ues_manquantes').insert(rows);
      if (ueError) console.warn('UE manquantes non enregistrées :', ueError);
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
