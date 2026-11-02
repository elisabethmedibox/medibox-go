/* ============================================================
   AUTH-VALIDATION.JS — Helpers partagés pour la validation
   du domaine d'email universitaire à l'inscription.
   Utilisé par inscription.js (P2-D4) et inscription-pass-las.js.
   ============================================================ */

window.AuthValidation = (function () {

  async function loadUniversites(sb) {
    const { data, error } = await sb.from('universites')
      .select('id, nom, ville, domaine_email')
      .order('nom');
    if (error) throw error;
    return data;
  }

  async function loadDomainesPersos(sb) {
    const { data, error } = await sb.from('domaines_email_persos').select('domaine');
    if (error) {
      console.warn('Blacklist domaines persos non chargée', error);
      return new Set();
    }
    return new Set(data.map(d => d.domaine.toLowerCase()));
  }

  function extractDomain(email) {
    if (!email) return '';
    const at = email.indexOf('@');
    return at === -1 ? '' : email.slice(at + 1).toLowerCase().trim();
  }

  function validateEmailUniv(email, universite, domainesPersos) {
    if (!email || email.indexOf('@') === -1) {
      return { valid: false, error: 'Adresse email invalide.' };
    }
    if (!universite) {
      return { valid: false, error: 'Choisissez d\'abord votre université.' };
    }
    const domain = extractDomain(email);

    if (universite.domaine_email) {
      if (domain !== universite.domaine_email.toLowerCase()) {
        return {
          valid: false,
          error: 'Pour ' + universite.nom + ', utilisez votre adresse @' + universite.domaine_email
        };
      }
      return { valid: true, error: null };
    }

    if (domainesPersos && domainesPersos.has(domain)) {
      return {
        valid: false,
        error: 'Veuillez utiliser votre adresse universitaire (pas une adresse personnelle type Gmail/Yahoo/etc.).'
      };
    }
    return { valid: true, error: null };
  }

  function updateEmailHint(hintEl, universite) {
    if (!hintEl) return;
    if (!universite) {
      hintEl.textContent = '';
      hintEl.className = 'email-hint';
      return;
    }
    if (!universite.domaine_email) {
      hintEl.textContent = 'Utilisez votre adresse universitaire (pas un Gmail/Yahoo).';
      hintEl.className = 'email-hint';
      return;
    }
    hintEl.textContent = 'Doit finir par @' + universite.domaine_email;
    hintEl.className = 'email-hint email-hint-strict';
  }

  return {
    loadUniversites,
    loadDomainesPersos,
    extractDomain,
    validateEmailUniv,
    updateEmailHint
  };
})();
