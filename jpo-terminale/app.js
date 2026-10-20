/* ============================================================
   JPO TERMINALE SANTÉ · 28 et 29 octobre 2026 — logique du formulaire

   Trois créneaux, chacun étant un ÉVÉNEMENT à part entière :
     mercredi 28 matin · mercredi 28 fin de journée · jeudi 29 immersion.

   - ⛔ UNE LIGNE PAR CRÉNEAU CHOISI. Quelqu'un qui vient le mercredi ET
     le jeudi produit deux lignes, une par slug. C'est ce qui donne le
     récapitulatif par séquence sans rien recouper.
   - Les créneaux sont insérés un par un, jamais en lot : si la personne
     est déjà inscrite au mercredi mais pas au jeudi, le jeudi doit
     quand même passer.
   - Niveau toujours « Terminale » : ce formulaire ne s'adresse qu'à eux,
     on ne le demande donc pas. ⛔ La valeur doit rester écrite ainsi,
     la policy d'insertion n'accepte qu'une liste fermée de libellés.
   - Anti-spam : honeypot + on n'expose aucune liste.
   ============================================================ */

// ─── Config Supabase (clés PUBLIQUES uniquement) ───
const SUPABASE_URL = 'https://uozfgssyswxjapscklan.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvemZnc3N5c3d4amFwc2NrbGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDEwODksImV4cCI6MjA5MDE3NzA4OX0.XoO9fWh0PqgEmt7zvlEfJeUcnfT2hVP_o5ORlXr7ZDQ';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const NIVEAU = 'Terminale';

// Les trois créneaux : la case qui les coche, et leur libellé lisible.
const CRENEAUX = [
  { case: 'cr1', slug: 'jpo-terminale-2026-10-28-matin', libelle: 'mercredi 28 octobre de 9h00 à 11h00' },
  { case: 'cr2', slug: 'jpo-terminale-2026-10-28-soir',  libelle: 'mercredi 28 octobre de 17h00 à 20h00' },
  { case: 'cr3', slug: 'jpo-terminale-2026-10-29',       libelle: "jeudi 29 octobre de 8h00 à 12h00 pour l'immersion" }
];
const LIBELLE_CRENEAU = {};
CRENEAUX.forEach(c => { LIBELLE_CRENEAU[c.slug] = c.libelle; });

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

// ─── Lecture d'un bloc parent ───
function lireParent(prefixe) {
  return {
    prenom: document.getElementById(prefixe + 'Prenom').value.trim(),
    nom: document.getElementById(prefixe + 'Nom').value.trim(),
    email: document.getElementById(prefixe + 'Email').value.trim().toLowerCase()
  };
}

/* ⛔ Le point doit être cherché APRÈS l'arobase, avec lastIndexOf.
   Comparer indexOf('.') à indexOf('@') ferait refuser « prenom.nom@… »,
   la forme la plus répandue : indexOf rend le PREMIER point. */
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

  // ─── Les créneaux ───
  const creneaux = CRENEAUX.filter(c => document.getElementById(c.case).checked).map(c => c.slug);
  if (creneaux.length === 0) {
    showMsg('error', 'Choisis au moins un créneau pour venir nous voir.');
    return;
  }

  // ─── Toi ───
  const prenom = document.getElementById('prenom').value.trim();
  const nom = document.getElementById('nom').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const telephone = document.getElementById('telephone').value.trim();

  if (!prenom) { invalide('prenom', 'Merci d\'indiquer ton prénom.'); return; }
  if (!nom) { invalide('nom', 'Merci d\'indiquer ton nom.'); return; }
  if (!emailValide(email)) { invalide('email', 'Merci de saisir une adresse e-mail valide.'); return; }
  if (!telephone) { invalide('telephone', 'Merci d\'indiquer un téléphone pour qu\'on puisse te joindre.'); return; }

  // ─── Le droit à l'image ───
  // ⛔ OBLIGATOIRE : condition de participation, annoncée avant l'inscription.
  const consentementImage = document.getElementById('consentementImage').checked;
  if (!consentementImage) {
    invalide('consentementImage',
      'Pour t\'inscrire, tu dois accepter d\'apparaître sur les photos de groupe.');
    document.getElementById('consentementImage').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

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

  // ─── Une insertion PAR CRÉNEAU, séparément ───
  const enregistres = [];
  const dejaInscrits = [];
  let panne = null;

  for (const slug of creneaux) {
    const { error } = await sb.from('evenement_inscriptions').insert({
      evenement_slug: slug,
      prenom: prenom,
      nom: nom,
      email: email,
      telephone: telephone,
      annee_prochaine: NIVEAU,
      accompagnement: accompagnement,
      accompagnants: accompagnants,
      consentement_image: consentementImage
    });

    if (!error) { enregistres.push(slug); continue; }
    // 23505 = déjà inscrit·e à CE créneau (index unique slug + e-mail).
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
  const dire = liste => {
    const noms = liste.map(s => LIBELLE_CRENEAU[s]);
    if (noms.length <= 1) return noms.join('');
    return noms.slice(0, -1).join(', ') + ' et ' + noms[noms.length - 1];
  };
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
    texte += '<br><br>Un des créneaux n\'a pas pu être enregistré. Écris-nous pour qu\'on le confirme.';
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
