/* ============================================================
   RENCONTRE MEDIBOX · 19 juin 2026 — logique du formulaire
   - Insertion publique dans evenement_inscriptions (RLS stricte :
     anon peut UNIQUEMENT inserer une ligne validee, jamais lire).
   - Anti-spam : honeypot + on n'expose aucune liste.
   - Galerie photos auto : depose des images dans photos/ (photo-1.jpg…)
     et elles apparaissent toutes seules.
   ============================================================ */

// ─── Config Supabase (cles PUBLIQUES uniquement) ───
const SUPABASE_URL = 'https://uozfgssyswxjapscklan.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvemZnc3N5c3d4amFwc2NrbGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDEwODksImV4cCI6MjA5MDE3NzA4OX0.XoO9fWh0PqgEmt7zvlEfJeUcnfT2hVP_o5ORlXr7ZDQ';

// Identifiant de CET evenement (la table sert aussi aux prochains).
const EVENEMENT_SLUG = 'rencontre-2026-06-19';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Photo de fond duotone : si photos/fond.jpg existe, on l'active ───
// Le hero et la zone du formulaire reçoivent alors la photo avec un voile bleu.
(function chargerFond() {
  const img = new Image();
  img.onload = () => {
    document.body.style.setProperty('--fond', "url('photos/fond.jpg')");
    document.body.classList.add('has-fond');
  };
  img.src = 'photos/fond.jpg';
})();

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

// ─── Soumission ───
document.getElementById('rencontreForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMsg();
  const btn = document.getElementById('btnSubmit');

  // Honeypot : si rempli, c'est un bot -> on fait semblant d'accepter, on n'ecrit rien.
  if (document.getElementById('site').value.trim() !== '') {
    afficherSucces();
    return;
  }

  const prenom = document.getElementById('prenom').value.trim();
  const nom = document.getElementById('nom').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const telephone = document.getElementById('telephone').value.trim();
  const annee = document.getElementById('anneeProchaine').value;

  // ─── Validation ───
  function invalide(id, msg) {
    document.getElementById(id).classList.add('error');
    showMsg('error', msg);
  }
  if (!prenom) { invalide('prenom', 'Merci d\'indiquer ton prénom.'); return; }
  if (!nom) { invalide('nom', 'Merci d\'indiquer ton nom.'); return; }
  if (!email || email.indexOf('@') < 1 || email.indexOf('.') === -1) { invalide('email', 'Merci de saisir une adresse e-mail valide.'); return; }
  if (!telephone) { invalide('telephone', 'Merci d\'indiquer un téléphone pour qu\'on puisse te joindre.'); return; }
  if (!annee) { invalide('anneeProchaine', 'Dis-nous où tu passes l\'année prochaine.'); return; }

  btn.disabled = true;
  btn.textContent = '⏳ Enregistrement...';

  try {
    const { error } = await sb.from('evenement_inscriptions').insert({
      evenement_slug: EVENEMENT_SLUG,
      prenom: prenom,
      nom: nom,
      email: email,
      telephone: telephone,
      annee_prochaine: annee
    });

    if (error) {
      // 23505 = doublon (meme e-mail deja inscrit a cet evenement)
      if (error.code === '23505') {
        afficherSucces('Tu es déjà inscrit·e avec cette adresse — on t\'attend le samedi 19 juin à la Marina du Gosier, entre 10h et 16h. À très vite !');
        return;
      }
      console.error('Erreur insertion :', error);
      showMsg('error', 'Oups, une erreur est survenue. Réessaie dans un instant ou écris-nous.');
      btn.disabled = false;
      btn.textContent = 'Je réserve ma place';
      return;
    }

    afficherSucces();

  } catch (err) {
    console.error(err);
    showMsg('error', 'Oups, une erreur est survenue. Réessaie dans un instant.');
    btn.disabled = false;
    btn.textContent = 'Je réserve ma place';
  }
});

// ─── Écran de succès ───
function afficherSucces(texteCustom) {
  const form = document.getElementById('rencontreForm');
  const box = document.getElementById('successBox');
  if (texteCustom) {
    document.getElementById('successText').innerHTML = texteCustom;
  }
  form.hidden = true;
  box.hidden = false;
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
