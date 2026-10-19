/* ============================================================
   JPO MEDIBOX · 26 et 27 octobre 2026 — logique du formulaire

   - Insertion publique dans evenement_inscriptions (RLS stricte :
     anon peut UNIQUEMENT insérer une ligne validée, jamais lire).
   - ⛔ UNE LIGNE PAR JOUR CHOISI : qui coche les deux journées produit
     deux lignes, une par slug. L'effectif de chaque journée se lit
     ainsi directement, sans rien recompter.
   - Les journées sont insérées une par une, jamais en lot : si la
     personne est déjà inscrite au 26 mais pas au 27, le 27 doit
     quand même passer.
   - Anti-spam : honeypot + on n'expose aucune liste.
   ============================================================ */

// ─── Config Supabase (clés PUBLIQUES uniquement) ───
const SUPABASE_URL = 'https://uozfgssyswxjapscklan.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvemZnc3N5c3d4amFwc2NrbGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDEwODksImV4cCI6MjA5MDE3NzA4OX0.XoO9fWh0PqgEmt7zvlEfJeUcnfT2hVP_o5ORlXr7ZDQ';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Libellé lisible de chaque journée, pour les messages.
const LIBELLE_JOUR = {
  'jpo-2026-10-26': 'lundi 26 octobre à 19h00',
  'jpo-2026-10-27': 'mardi 27 octobre à 20h00'
};

// Chaque soirée a son public : le lundi les P2 et les D1, le mardi les
// externes. On coche la bonne case quand l'étudiant choisit son niveau,
// SANS jamais l'y enfermer : il reste libre de changer, ou de venir aux deux.
// ⛔ Les clés doivent être ÉCRITES COMME DANS LE MENU (même forme Unicode) :
// un « é » décomposé ne s'appareille pas à un « é » composé, et la
// correspondance échouerait en silence.
const JOUR_DU_NIVEAU = {
  '2e année médecine': 'jour26',
  '3e année médecine': 'jour26',
  '4e année': 'jour27',
  '5e année': 'jour27',
  '6e année': 'jour27'
};

// ─── Messages ───
function showMsg(type, text) {
  const el = document.getElementById('msg');
  el.className = 'msg show ' + type;
  el.textContent = text;
}
function clearMsg() { document.getElementById('msg').className = 'msg'; }

// ─── Nettoyer l'erreur visuelle au focus ───
document.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('focus', () => el.classList.remove('error'));
});

// ─── Afficher les blocs parents selon le choix ───
function majBlocsParents() {
  const choix = document.querySelector('input[name="accompagnement"]:checked');
  const valeur = choix ? choix.value : 'seul';
  document.getElementById('blocParent1').hidden = (valeur === 'seul');
  document.getElementById('blocParent2').hidden = (valeur !== 'deux_parents');
}
document.querySelectorAll('input[name="accompagnement"]').forEach(r => {
  r.addEventListener('change', majBlocsParents);
});
majBlocsParents();

// ⭐ On ne coche que si AUCUNE soirée n'est encore choisie : sinon on
// écraserait un choix délibéré (quelqu'un qui veut venir les deux soirs).
document.getElementById('niveau').addEventListener('change', (e) => {
  const cible = JOUR_DU_NIVEAU[e.target.value];
  if (!cible) return;
  const deja = document.getElementById('jour26').checked || document.getElementById('jour27').checked;
  if (deja) return;
  document.getElementById(cible).checked = true;
  const aide = document.getElementById('aideJours');
  if (aide) aide.textContent = 'On a coché la soirée qui correspond à ton niveau. Tu peux la changer, ou venir aux deux.';
});

// ─── Lecture d'un bloc parent ───
function lireParent(prefixe) {
  return {
    prenom: document.getElementById(prefixe + 'Prenom').value.trim(),
    nom: document.getElementById(prefixe + 'Nom').value.trim(),
    email: document.getElementById(prefixe + 'Email').value.trim().toLowerCase()
  };
}

/* ⛔ Le point doit être cherché APRÈS l'arobase, avec lastIndexOf.
   Une première version comparait indexOf('.') à indexOf('@') : comme
   indexOf rend le PREMIER point, « prenom.nom@exemple.fr » était refusé.
   C'est la forme d'adresse la plus répandue chez les étudiants, et
   l'adresse universitaire elle-même : le formulaire refusait tout le
   monde. Trouvé en remplissant le formulaire pour de vrai. */
function emailValide(mail) {
  if (!mail || mail.length > 150) return false;
  const at = mail.indexOf('@');
  if (at < 1) return false;
  const point = mail.lastIndexOf('.');
  return point > at + 1 && point < mail.length - 1;
}

// ─── Soumission ───
document.getElementById('jpoForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMsg();
  const btn = document.getElementById('btnSubmit');

  // Honeypot : si rempli, c'est un bot. On fait semblant d'accepter, on n'écrit rien.
  if (document.getElementById('site').value.trim() !== '') {
    afficherSucces();
    return;
  }

  function invalide(id, msg) {
    const el = document.getElementById(id);
    if (el) el.classList.add('error');
    showMsg('error', msg);
  }

  // ─── Les journées ───
  const jours = [];
  if (document.getElementById('jour26').checked) jours.push('jpo-2026-10-26');
  if (document.getElementById('jour27').checked) jours.push('jpo-2026-10-27');
  if (jours.length === 0) {
    showMsg('error', 'Choisis au moins une journée : le 26, le 27, ou les deux.');
    return;
  }

  // ─── Toi ───
  const prenom = document.getElementById('prenom').value.trim();
  const nom = document.getElementById('nom').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const telephone = document.getElementById('telephone').value.trim();
  const niveau = document.getElementById('niveau').value;

  if (!prenom) { invalide('prenom', 'Merci d\'indiquer ton prénom.'); return; }
  if (!nom) { invalide('nom', 'Merci d\'indiquer ton nom.'); return; }
  if (!emailValide(email)) { invalide('email', 'Merci de saisir une adresse e-mail valide.'); return; }
  if (!telephone) { invalide('telephone', 'Merci d\'indiquer un téléphone pour qu\'on puisse te joindre.'); return; }
  if (!niveau) { invalide('niveau', 'Dis-nous en quelle année tu es.'); return; }

  // ─── Le droit à l'image (facultatif, jamais bloquant) ───
  const consentementImage = document.getElementById('consentementImage').checked;

  // ─── L'accompagnement ───
  const choix = document.querySelector('input[name="accompagnement"]:checked');
  const accompagnement = choix ? choix.value : 'seul';
  const accompagnants = [];

  if (accompagnement !== 'seul') {
    const p1 = lireParent('p1');
    if (!p1.prenom || !p1.nom) { invalide('p1Prenom', 'Merci d\'indiquer le prénom et le nom du premier parent.'); return; }
    if (!emailValide(p1.email)) { invalide('p1Email', 'Merci de saisir une adresse e-mail valide pour le premier parent.'); return; }
    accompagnants.push(p1);
  }
  if (accompagnement === 'deux_parents') {
    const p2 = lireParent('p2');
    if (!p2.prenom || !p2.nom) { invalide('p2Prenom', 'Merci d\'indiquer le prénom et le nom du second parent.'); return; }
    if (!emailValide(p2.email)) { invalide('p2Email', 'Merci de saisir une adresse e-mail valide pour le second parent.'); return; }
    accompagnants.push(p2);
  }

  btn.disabled = true;
  btn.textContent = '⏳ Enregistrement...';

  // ─── Une insertion PAR JOUR, séparément ───
  const enregistres = [];
  const dejaInscrits = [];
  let panne = null;

  for (const slug of jours) {
    const { error } = await sb.from('evenement_inscriptions').insert({
      evenement_slug: slug,
      prenom: prenom,
      nom: nom,
      email: email,
      telephone: telephone,
      annee_prochaine: niveau,
      accompagnement: accompagnement,
      accompagnants: accompagnants,
      consentement_image: consentementImage
    });

    if (!error) { enregistres.push(slug); continue; }
    // 23505 = déjà inscrit·e à CETTE journée (index unique slug + e-mail).
    if (error.code === '23505') { dejaInscrits.push(slug); continue; }
    console.error('Erreur insertion (' + slug + ') :', error);
    panne = error;
  }

  if (panne && enregistres.length === 0 && dejaInscrits.length === 0) {
    showMsg('error', 'Oups, une erreur est survenue. Réessaie dans un instant ou écris-nous.');
    btn.disabled = false;
    btn.textContent = 'Je réserve ma place';
    return;
  }

  // ─── Message de confirmation, fidèle à ce qui s'est réellement passé ───
  const dire = liste => liste.map(s => LIBELLE_JOUR[s]).join(' et ');
  let texte;
  if (enregistres.length && dejaInscrits.length) {
    texte = 'Ta place est réservée pour le <strong>' + dire(enregistres) + '</strong>. '
          + 'Tu étais déjà inscrit·e pour le ' + dire(dejaInscrits) + '.';
  } else if (enregistres.length) {
    texte = 'On t\'attend le <strong>' + dire(enregistres) + '</strong>'
          + (accompagnants.length ? ', avec ' + (accompagnants.length === 1 ? 'ton parent' : 'tes deux parents') : '')
          + '. À très vite !';
  } else {
    texte = 'Tu es déjà inscrit·e pour le <strong>' + dire(dejaInscrits) + '</strong>. On t\'attend !';
  }
  if (panne) {
    texte += '<br><br>Une des deux journées n\'a pas pu être enregistrée. Écris-nous pour qu\'on la confirme.';
  }
  afficherSucces(texte);
});

// ─── Écran de succès ───
function afficherSucces(texteCustom) {
  const form = document.getElementById('jpoForm');
  const box = document.getElementById('successBox');
  if (texteCustom) {
    document.getElementById('successText').innerHTML = texteCustom;
  }
  form.hidden = true;
  box.hidden = false;
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
