/* ============================================================
   INSCRIPTION-LPS.JS - Réservation Licence Portail Santé 2027-2028
   Copie adaptée du formulaire PASS-LAS (inscription-pass-las/) :
   - Année figée 2027-2028, niveau figé LPS (pas de formule : elle se
     choisit à l'inscription définitive, décision du site vitrine)
   - L'université se déduit du département (Guyane -> Université de
     Guyane, sinon Université des Antilles) : un lycéen ne la connaît pas
   - Crée un compte verrouillé (rôle etudiant_preinscrit via le flag
     is_preinscription du trigger handle_new_user)
   - Enregistre le dossier dans inscriptions_pass_las (source =
     inscription_lps, le programme des frais) + référents facultatifs
   - Compte déjà existant (ex-élève, Terminale Santé) : connexion avec le
     mot de passe saisi, puis dossier 2027-2028 ajouté sur ce compte
   - Redirige vers la page de paiement des frais de réservation (190 €)
   ============================================================ */

const ANNEE_LPS = '2027-2028';
const NIVEAU_LPS = 'LPS';
const PROGRAMME_LPS = 'inscription_lps';

// ─── Appliquer la config ───
document.title = 'Inscription Licence Portail Santé ' + ANNEE_LPS + ' - ' + APP_CONFIG.brandName;
document.getElementById('logoImg').src = APP_CONFIG.logoUrl;
document.getElementById('logoImg').alt = APP_CONFIG.brandName;
document.getElementById('brandPart1').textContent = APP_CONFIG.brandPart1;
document.getElementById('brandPart2').textContent = APP_CONFIG.brandPart2;
document.getElementById('year').textContent = ANNEE_LPS;
document.getElementById('footer').innerHTML = APP_CONFIG.copyright + (APP_CONFIG.contactTel ? ' · <a href="' + APP_CONFIG.contactTelHref + '" style="color:inherit;">📞 ' + APP_CONFIG.contactTel + '</a>' : '');

// ─── Client Supabase ───
const sb = window.supabase.createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabaseAnonKey);

// ─── État partagé ───
let departementsByCode = new Map();
let universites = [];
let anneeEtudeId = null;

const LIBELLE_BOUTON = 'Réserver ma place';

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
  const selDep = document.getElementById('departementEtudes');
  try {
    const [departementsRes, universitesRes, anneesRes] = await Promise.all([
      sb.from('departements').select('id, code, libelle')
        .eq('actif', true).neq('code', 'Métropole').order('libelle'),
      sb.from('universites').select('id, nom')
        .eq('ouvert_inscription_pass_las', true).order('nom'),
      sb.from('annees_etude').select('id, libelle').eq('libelle', ANNEE_LPS).maybeSingle()
    ]);

    const departements = departementsRes.data || [];
    universites = universitesRes.data || [];
    anneeEtudeId = anneesRes.data ? anneesRes.data.id : null;

    departements.forEach(d => departementsByCode.set(d.code, d));
    fillSelect('departementEtudes', departements, 'code', d => d.libelle, '- Choisir -');
  } catch (e) {
    selDep.innerHTML = '<option value="">Erreur de chargement</option>';
    console.error('Erreur chargement données :', e);
  }
}

// ─── Université déduite du département ───
function universitePourDepartement(codeDep) {
  const cible = (codeDep === 'Guyane') ? 'guyane' : 'antilles';
  const u = universites.find(x => (x.nom || '').toLowerCase().indexOf(cible) !== -1);
  return u ? u.id : null;
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
function rearmer(btn) {
  btn.disabled = false;
  btn.textContent = LIBELLE_BOUTON;
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

// ─── Dossier de réservation + référents, puis page de paiement ───
async function enregistrerDossier(userId, champs) {
  const { data: inscription, error: inscriptionError } = await sb.from('inscriptions_pass_las')
    .insert({
      user_id: userId,
      annee_etude_id: anneeEtudeId,
      formule_id: null,
      departement_etudes_id: champs.departementId,
      est_finance_par_proche: champs.financeParProche,
      statut_paiement: 'en_attente_paiement',
      source: PROGRAMME_LPS,
      nom: champs.nom,
      prenom: champs.prenom,
      email: champs.email,
      telephone: champs.telephone
    })
    .select('id')
    .single();

  if (inscriptionError) {
    console.error('Erreur enregistrement réservation :', inscriptionError);
    return false;
  }

  const referents = collectReferents();
  if (referents.length > 0) {
    const rows = referents.map(r => ({ inscription_id: inscription.id, ...r }));
    const { error: refError } = await sb.from('inscriptions_referents').insert(rows);
    if (refError) console.warn('Référents non enregistrés :', refError);
  }
  return true;
}

function versPaiement(btn, texte) {
  showMsg('success', texte || 'Compte créé ! Redirection vers le paiement...');
  btn.textContent = 'Compte créé !';
  setTimeout(() => { window.location.href = 'merci-inscription-lps.html'; }, 1200);
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
  const indicatif = document.getElementById('indicatif').value;
  const telNum = document.getElementById('telephone').value.trim();
  const telephone = indicatif + telNum;
  const dateNaissance = document.getElementById('dateNaissance').value;
  const rue = document.getElementById('rue').value.trim();
  const codePostal = document.getElementById('codePostal').value.trim();
  const ville = document.getElementById('ville').value.trim().toUpperCase();
  const departementCode = document.getElementById('departementEtudes').value;
  const financeParProche = document.getElementById('financeParProche').value === 'oui';

  if (!email || email.indexOf('@') === -1) {
    showMsg('error', 'Merci de saisir une adresse email valide.');
    document.getElementById('email').classList.add('error');
    rearmer(btn);
    return;
  }

  const dep = departementsByCode.get(departementCode) || null;
  if (!dep) {
    showMsg('error', 'Merci de choisir ton département d\'études.');
    rearmer(btn);
    return;
  }
  if (!anneeEtudeId) {
    showMsg('error', 'L\'année ' + ANNEE_LPS + ' n\'est pas disponible. Contacte la direction.');
    rearmer(btn);
    return;
  }

  const champs = {
    nom: nom, prenom: prenom, email: email, telephone: telephone,
    departementId: dep.id, financeParProche: financeParProche
  };

  try {
    // Doublon : un dossier existe déjà pour ce nom, ce prénom et cette date de
    // naissance. On ne crée pas un second compte, on renvoie vers la prépa.
    if (nom && prenom && dateNaissance) {
      const { data: dbl } = await sb.rpc('inscription_doublon_check', {
        p_nom: nom, p_prenom: prenom, p_date_naissance: dateNaissance
      });
      if (dbl && dbl.doublon) {
        showMsg('error', 'Tu sembles déjà inscrit·e. Merci d\'appeler directement la prépa '
          + 'aux numéros figurant sur le site internet.');
        rearmer(btn);
        return;
      }
    }

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
          universite_id: universitePourDepartement(departementCode),
          niveau: NIVEAU_LPS,
          annee_etude: ANNEE_LPS,
          departement: departementCode,
          email_personnel: email,
          // Flag clé : le trigger assigne le rôle verrouillé etudiant_preinscrit
          is_preinscription: true
        }
      }
    });

    // Compte déjà existant : soit l'erreur explicite, soit (protection
    // anti-énumération Supabase) un faux utilisateur sans identité.
    const dejaInscrit = (authError && /already registered/i.test(authError.message))
      || (!authError && authData && authData.user && Array.isArray(authData.user.identities) && authData.user.identities.length === 0);

    if (dejaInscrit) {
      const { data: connexion, error: errConnexion } = await sb.auth.signInWithPassword({ email: email, password: mdp });
      if (errConnexion || !connexion || !connexion.user) {
        showMsg('error', 'Cette adresse a déjà un compte MediBox. Saisis le mot de passe de ce compte pour y ajouter ta réservation, '
          + 'ou utilise « Mot de passe oublié » sur la page de connexion de l\'application.');
        rearmer(btn);
        return;
      }
      const userId = connexion.user.id;
      const { data: existant } = await sb.from('inscriptions_pass_las')
        .select('id, statut_paiement').eq('user_id', userId).eq('annee_etude_id', anneeEtudeId).maybeSingle();
      if (existant) {
        if (existant.statut_paiement === 'paye') {
          showMsg('success', 'Ta place ' + ANNEE_LPS + ' est déjà réservée et réglée. Il n\'y a rien d\'autre à faire.');
          btn.textContent = 'Place déjà réservée';
          return;
        }
        versPaiement(btn, 'Ta réservation ' + ANNEE_LPS + ' existe déjà. Redirection vers le paiement...');
        return;
      }
      const ok = await enregistrerDossier(userId, champs);
      if (!ok) {
        showMsg('error', 'Connexion réussie, mais l\'enregistrement de la réservation a échoué. Contacte la direction.');
        rearmer(btn);
        return;
      }
      versPaiement(btn, 'Réservation ajoutée à ton compte ! Redirection vers le paiement...');
      return;
    }

    if (authError) {
      showMsg('error', 'Erreur : ' + authError.message);
      rearmer(btn);
      return;
    }

    const userId = authData.user ? authData.user.id : null;
    if (!userId) {
      showMsg('error', 'Compte créé mais session indisponible. Contacte la direction.');
      rearmer(btn);
      return;
    }

    const ok = await enregistrerDossier(userId, champs);
    if (!ok) {
      showMsg('error', 'Compte créé, mais l\'enregistrement de la réservation a échoué. Contacte la direction.');
      rearmer(btn);
      return;
    }

    // Redirection vers la page de paiement (la session reste active, le rôle
    // etudiant_preinscrit n'a aucun accès aux données via RLS)
    versPaiement(btn);

  } catch (err) {
    showMsg('error', 'Erreur : ' + err.message);
    rearmer(btn);
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
