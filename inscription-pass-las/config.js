/**
 * Configuration centrale de l'application
 * Modifier ici pour changer le nom, le logo, la navigation ou l'année partout d'un coup
 */
const APP_CONFIG = {
  // Nom de la prépa — affiché partout (titres, PDFs, copyright, etc.)
  brandName: 'MediBox Antilles Guyane',

  // Logo : "MediBox" sur ligne 1 (Medi blanc/navy + Box corail)
  // + "Antilles Guyane" sur ligne 2 (couleur de brandPart1, plus petit)
  brandPart1: 'Medi',                 // couleur principale (blanc/navy selon fond)
  brandPart2: 'Box',                  // couleur corail
  brandPart3: 'Antilles Guyane',      // ligne 2 sous le logo, même couleur que part1

  // Sous-titre optionnel (laisser vide pour ne rien afficher)
  subtitle: '',

  // Année universitaire affichée
  year: '2026-2027',

  // Logo — version couleur (M bleu marine + serpent rouge) lisible sur fond clair
  // Chemin relatif : depuis pages/*.html ou auth/*.html on remonte d'un niveau pour atteindre assets/
  logoUrl: '../assets/logo-medibox.png',

  // Copyright
  copyright: '© MediBox Antilles Guyane 2026 - Tracking EDN / ECOS',

  // Dates des concours (pour les comptes à rebours)
  dateEDN: '2027-10-12',
  dateECOS: '2028-06-15',

  // Supabase (clés publiques uniquement — la service_role_key ne va JAMAIS ici)
  supabaseUrl: 'https://uozfgssyswxjapscklan.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvemZnc3N5c3d4amFwc2NrbGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDEwODksImV4cCI6MjA5MDE3NzA4OX0.XoO9fWh0PqgEmt7zvlEfJeUcnfT2hVP_o5ORlXr7ZDQ',

  // ─── NAVIGATION SIDEBAR ───
  // Pour ajouter/supprimer une page : modifier ce tableau
  // Chaque section a une couleur, un emoji, un label, et ses sous-pages
  sidebarSections: [
    {
      id: 'sec-fac', color: '#e91e8c', icon: '🎓', label: 'Cours facultaires',
      items: [
        { icon: '🎤', label: 'Oral PASS-LAS', href: 'cours-facultaires-pass-las-oral.html' },
        { icon: '🌱', label: 'PASS-LAS', href: 'cours-facultaires-pass-las.html' },
        { icon: '📘', label: 'P2', href: 'cours-facultaires.html?niveau=P2' },
        { icon: '📗', label: 'D1', href: 'cours-facultaires.html?niveau=D1' }
      ]
    },
    {
      id: 'sec-edn', color: '#f34c4b', icon: '📋', label: 'EDN',
      items: [
        { icon: '📋', label: 'Items', href: 'items-edn.html', badge: '367' },
        { icon: '📅', label: 'JAPDC', href: 'japdc.html' },
        { icon: '💯', label: 'Les scores à connaître', href: 'scores.html' },
        { icon: '⚡', label: 'Les 1ères intentions', href: 'premieres-intentions.html' }
      ]
    },
    {
      id: 'sec-lca', color: '#e6c223', icon: '🇬🇧', label: 'LCA',
      items: [
        { icon: '📄', label: 'Fiches', href: 'fiches-lca.html' },
        { icon: '🎬', label: 'Médias', href: 'medias-lca.html' }
      ]
    },
    {
      id: 'sec-ecos', color: '#4caf50', icon: '🩺', label: 'ECOS',
      items: [
        { icon: '🗂️', label: 'SDD', href: 'sdd.html' },
        { icon: '🎬', label: 'Médias', href: 'medias-ecos.html' },
        { icon: '⚔️', label: 'Match', href: 'ecos-match.html' }
      ]
    },
    {
      id: 'sec-entrain', color: '#0d9488', icon: '🧠', label: 'Entraînements',
      items: [
        { icon: '👥', label: 'Match Oral PASS-LAS', href: 'match.html', badgeId: 'navBadgeMatch' },
        { icon: '❓', label: 'QCM', href: 'generateur-qcm.html' },
        { icon: '🇬🇧', label: 'LCA', href: 'lca-entrainement.html' },
        { icon: '📜', label: 'Annales', href: 'annales.html' },
        { icon: '🎓', label: 'Masterclasses', href: 'masterclasses.html' },
        { icon: '▶️', label: 'Replay', href: 'replay.html' },
        { icon: '✏️', label: 'Khôlles', href: 'kholles.html' },
        { icon: '📝', label: 'CCB', href: 'ccb.html' }
      ]
    },
    {
      id: 'sec-merlin', color: '#06b6d4', icon: '🧙', label: 'Merlin',
      items: [
        { icon: '💬', label: 'Travailler avec Merlin', href: 'merlin.html' },
        { icon: '⚡', label: 'Recharger mes crédits', href: 'merlin-recharger.html' }
      ]
    },
    {
      id: 'sec-suivi', color: '#5b7ec7', icon: '📅', label: 'Suivi',
      items: [
        { icon: '🗓️', label: 'Agenda', href: 'agenda.html' },
        { icon: '📆', label: 'Événements', href: 'evenements.html' },
        { icon: '🎬', label: 'Replays', href: 'replays.html' },
        { icon: '📢', label: 'Annonces', href: 'annonces.html' },
        { icon: '🎯', label: 'Mon coaching', href: 'inscription-coaching.html', roles: ['etudiant_pass_las'] },
        { icon: '📊', label: 'Mes stats en détail', href: 'stats.html' }
      ]
    },
    {
      id: 'sec-autres', color: '#9e9bb0', icon: '📦', label: 'Autres',
      items: [
        { icon: '📖', label: 'Ma bibliothèque', href: 'bibliotheque.html' },
        { icon: '🏛️', label: 'Recos HAS', href: 'recos-has.html' },
        { icon: '🧭', label: 'La méthodologie', href: 'methodologie.html' },
        { icon: 'ℹ️', label: 'Infos EDN', href: 'infos-edn.html' },
        { icon: 'ℹ️', label: 'Infos ECOS', href: 'infos-ecos.html' },
        { icon: '📰', label: 'Actualité médicale', href: 'actualite-medicale.html' },
        { icon: '⚙️', label: 'Mes réglages', href: 'reglages.html' }
      ]
    },
    {
      id: 'sec-compte', color: '#0d9488', icon: '👤', label: 'Mon compte',
      items: [
        { icon: '🪪', label: 'Mon profil', href: 'mon-profil.html' },
        { icon: '📝', label: 'Mes attestations', href: 'mon-attestation.html' },
        { icon: '💳', label: 'Mes abonnements', href: 'mes-abonnements.html' }
      ]
    },
    // ─── Espace invité.e (séparateur, visible pour tous, position dynamique) ───
    // Pour les invités (role=etudiant_invite), shared.js déplace ce bloc tout en haut.
    // Pour tous les autres rôles, le bloc reste à cette position (en bas, avant les Espaces réservés).
    {
      id: 'sec-invite', color: '#6f4e37', icon: '🎁', label: 'Espace invité.e',
      separator: true,
      items: [
        { icon: '📝', label: 'Correction S2 2025-2026', href: 'invite-correction-s2.html' },
        { icon: '📊', label: 'Estimation moyenne 2025-2026', href: 'invite-estimation-moyenne.html' },
        { icon: '🏆', label: 'Mes résultats 2025-2026', href: 'resultats-2025-2026.html' }
      ]
    },
    // ─── Espaces réservés (séparateur + accès conditionnel par rôle) ───
    {
      id: 'sec-admin', color: '#dc2626', icon: '🔒', label: 'Espaces réservés',
      separator: true,
      roles: ['superadmin', 'admin', 'redacteur', 'lecteur', 'tuteur', 'coach', 'relecteur'],
      items: [
        { icon: '🏠', label: 'Espace intervenant', href: 'dashboard-staff.html', roles: ['tuteur', 'coach', 'redacteur', 'relecteur', 'lecteur'] },
        { icon: '🛡️', label: 'Administration générale', href: 'admin-general.html', roles: ['superadmin'] },
        { icon: '📚', label: 'Administration pédagogique', href: 'admin-pedagogique.html', roles: ['superadmin', 'admin', 'redacteur', 'lecteur'] },
        { icon: '🎬', label: 'Marketing', href: 'admin-marketing.html', roles: ['superadmin', 'admin'] },
        { icon: '📋', label: 'Candidatures', href: 'admin-droits.html#acc-candidats', roles: ['superadmin', 'admin'] }
      ]
    }
  ],

  // ─── Modules admin (vignettes hub) ───
  adminModules: [
    { id: 'mes-notes', emoji: '📝', title: 'Mes notes', desc: 'Mon bloc-notes personnel · à faire, urgent, fait', color: '#0d9488', href: 'mes-notes-admin.html', roles: ['superadmin', 'admin'] },
    { id: 'droits', emoji: '🛡️', title: 'Gestion des droits', desc: 'Utilisateurs, rôles et affectations', color: '#dc2626', href: 'admin-droits.html', roles: ['superadmin'] },
    { id: 'items', emoji: '📋', title: 'Gestion des items', desc: 'Modifier les fiches et contenus', color: '#01466e', href: 'admin-items.html', roles: ['superadmin', 'admin'] },
    { id: 'qcm', emoji: '🧠', title: 'Banque de QCM', desc: 'Import, validation et gestion des questions', color: '#06b6d4', href: 'admin-qcm.html', roles: ['superadmin', 'admin'] },
    { id: 'etudiants', emoji: '👥', title: 'Suivi étudiants', desc: 'Inscriptions, connexions et statistiques', color: '#f97316', href: 'admin-etudiants.html', roles: ['superadmin'] },
    { id: 'contenu', emoji: '📚', title: 'Contenus pédagogiques', desc: 'Collèges, sources, supports', color: '#7c3aed', href: 'admin-contenu.html', roles: ['superadmin', 'admin'] },
    { id: 'stats', emoji: '📊', title: 'Statistiques globales', desc: 'Métriques, usage et performance', color: '#16a34a', href: 'admin-stats.html', roles: ['superadmin'] },
    { id: 'archives', emoji: '📦', title: 'Comptes archivés', desc: 'Étudiants et staff archivés, possibilité de les réactiver', color: '#f59e0b', href: 'admin-archives.html', roles: ['superadmin', 'admin'] },
    { id: 'attestations', emoji: '📝', title: 'Attestations signées', desc: 'Suivi des attestations signées par les étudiants (qui a signé, certificats)', color: '#0d9488', href: 'admin-attestations.html', roles: ['superadmin', 'admin'] },
    { id: 'reunions-staff', emoji: '🧑‍💼', title: 'Réunions staff', desc: 'Crée une visio de groupe pour l\'équipe et ajoute les participant·e·s · accès depuis leur agenda, sans enregistrement', color: '#6366f1', href: 'admin-reunions-staff.html', roles: ['superadmin', 'admin'] },
    { id: 'tickets', emoji: '🎫', title: 'Tickets', desc: 'Signalements et demandes des étudiants (analyse Merlin, etc.)', color: '#0d9488', href: 'tickets.html', roles: ['superadmin'] },
    { id: 'agents-ia', emoji: '🤖', title: 'Mes agents IA', desc: 'Tes skills et agents Claude : à quoi ils servent, comment les appeler, et leur prompt sauvegardé', color: '#6d28d9', href: 'admin-agents-ia.html', roles: ['superadmin'] }
  ],

  // ─── Sous-modules « Marketing » (page admin-marketing.html) ───
  marketingSubmodules: [
    { id: 'mes-videos', emoji: '🎥', title: 'Mes vidéos', desc: 'Enregistre des vidéos de présentation via ta webcam · les liens sont stockés pour réincrustation', color: '#ff5757', href: 'admin-marketing-videos.html', roles: ['superadmin', 'admin'] }
    // Modules à venir :
    // { id: 'landing-oral', emoji: '🏝️', title: 'Landing Oral PASS-LAS', desc: 'Page de vente publique', color: '#084f7b', href: 'admin-marketing-landings.html', roles: ['superadmin', 'admin'] }
  ],

  // ─── Sous-modules « Suivi étudiants » (page admin-etudiants.html) ───
  // NB : « Sessions oraux » est dans pedagogiqueModules ci-dessous, pas ici.
  etudiantsSubmodules: [
    { id: 'inscriptions', emoji: '📝', title: 'Inscriptions', desc: 'Dossiers et paiements par année (2025-2026, 2026-2027)', color: '#f97316', href: 'admin-inscriptions.html', roles: ['superadmin', 'admin'] },
    { id: 'eleves-2026-2027', emoji: '🎓', title: 'Élèves 2026-2027', desc: 'Vignettes par formule (MediPASS, MediFLEX, MediLAS+) · accès fiche complète', color: '#7c3aed', href: 'admin-eleves-2026-2027.html', roles: ['superadmin', 'admin'] }
    // Modules à venir :
    // { id: 'connexions', emoji: '🔐', title: 'Connexions', desc: 'Suivi des sessions', color: '#06b6d4', href: 'admin-etudiants-connexions.html', roles: ['superadmin'] },
    // { id: 'progression', emoji: '📊', title: 'Progression', desc: 'Items, QCM, maîtrise', color: '#16a34a', href: 'admin-etudiants-progression.html', roles: ['superadmin', 'admin'] },
    // { id: 'communications', emoji: '✉️', title: 'Communications', desc: 'Relances, emails, notifications', color: '#7c3aed', href: 'admin-etudiants-communications.html', roles: ['superadmin'] }
  ],

  // ─── Sous-vignettes « Inscriptions » par année (page admin-inscriptions.html) ───
  inscriptionsSubmodules: [
    { id: 'insc-2025', emoji: '📋', title: 'Inscriptions 2025-2026', desc: 'Liste, filtres et statuts de paiement (année en cours)', color: '#f97316', href: 'admin-etudiants-inscriptions.html', roles: ['superadmin', 'admin'] },
    { id: 'insc-2026', emoji: '🆕', title: 'Inscriptions 2026-2027', desc: 'Nouveaux dossiers de pré-inscription et frais d\'inscription', color: '#0d9488', href: 'admin-inscriptions-2026.html', roles: ['superadmin', 'admin'] }
  ],

  // ─── Modules « Administration pédagogique » (page admin-pedagogique.html) ───
  // Hub orienté pédagogie (oraux, contenus, ressources). Distinct du hub
  // « Administration générale » (admin-general.html) qui est plus orienté gestion.
  pedagogiqueModules: [
    { id: 'mes-coachings', emoji: '🏋️', title: 'Mes coachings', desc: 'Tes étudiant·e·s suivi·e·s : passages oraux, visio, replays, comptes-rendus', color: '#f97316', href: 'admin-mes-coachings.html', roles: ['superadmin', 'admin', 'coach', 'redacteur', 'tuteur_matiere', 'lecteur', 'relecteur'] },
    { id: 'programmation-coaching', emoji: '🗓️', title: 'Programmation coaching', desc: 'Vue tableau · qui passe quel MEM, à quelle date, statut et note', color: '#0284c7', href: 'admin-programmation-coaching.html', roles: ['superadmin', 'admin', 'coach', 'redacteur'] },
    { id: 'sessions-oraux', emoji: '🎤', title: 'Sessions oraux', desc: 'Planification et suivi des passages PASS-LAS', color: '#be123c', href: 'admin-etudiants-sessions-oraux.html', roles: ['superadmin', 'admin', 'redacteur', 'tuteur_matiere'] }
    // Modules à venir :
    // { id: 'cours-pass-las', emoji: '🌱', title: 'Cours PASS-LAS', desc: 'UE, modules et chapitres', color: '#16a34a', href: 'admin-cours-pass-las.html', roles: ['superadmin', 'admin', 'redacteur'] },
    // { id: 'cours-p2-d1', emoji: '📚', title: 'Cours P2/D1', desc: 'UE, modules et chapitres facultaires', color: '#7c3aed', href: 'admin-cours-p2-d1.html', roles: ['superadmin', 'admin', 'redacteur'] }
  ]
};
