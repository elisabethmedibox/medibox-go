/* ====================================================================
   CONTENU DE L'ATELIER RCP (réanimation cardio-pulmonaire)
   Éditable via l'éditeur sans code (/ateliers/editeur.html)
   ou à la main : on ne change que le texte entre guillemets.
   Pour ajouter une photo / vidéo : coller une URL dans "src".
   ==================================================================== */
window.ATELIER_DATA = {
  slug: "atelier_rcp_public",
  titre: "RCP",
  emoji: "🫀",
  public: "Grand public",
  famille: "geste-qui-sauve",

  accroche: {
    chiffre: ["7 arrêts cardiaques sur 10", "10 %"],
    phrase: "7 arrêts cardiaques sur 10 ont lieu devant un témoin. Ce témoin, ça peut être toi. Et chaque minute sans massage, c'est 10 % de chances de survie en moins.",
    source: "Fédération Française de Cardiologie",
    cta: "Je me lance",
    media: { type: "image", src: "", alt: "Mains réalisant un massage cardiaque" }
  },

  pourquoi: {
    titre: "Pourquoi ce geste ?",
    points: [
      "En France, seulement ~7 % des victimes survivent à un arrêt cardiaque : agir avant les secours change tout.",
      "Le cerveau manque d'oxygène en quelques minutes — chaque minute compte.",
      "Pas besoin d'être soignant : 3 gestes simples suffisent — appeler, masser, défibriller."
    ],
    media: { type: "video", src: "", label: "L'arrêt cardiaque expliqué (2 min)" }
  },

  geste: {
    titre: "Les 3 gestes qui sauvent",
    materiel: ["Mannequin de massage", "Tes deux mains", "Défibrillateur (DAE) de formation"],
    etapes: [
      { t: "Reconnaître l'arrêt cardiaque", d: "La personne ne répond pas et ne respire pas normalement." },
      { t: "Appeler le 15 (ou le 112)", d: "Ou fais appeler quelqu'un, et demande un défibrillateur." },
      { t: "Placer les mains", d: "Talon d'une main au centre de la poitrine, l'autre par-dessus, bras tendus." },
      { t: "Masser fort et vite", d: "On enfonce de 5 à 6 cm, 100 à 120 fois par minute (le rythme de « Stayin' Alive »)." },
      { t: "Ne pas s'arrêter", d: "On continue sans interruption jusqu'à l'arrivée des secours ou du défibrillateur." },
      { t: "Défibriller", d: "Dès qu'un défibrillateur (DAE) arrive : on l'allume et on suit sa voix, elle guide tout." }
    ],
    media: { type: "video", src: "", label: "Le massage cardiaque pas à pas (2 min)" }
  },

  identification: {
    titre: "Dis-nous qui tu es",
    sousTitre: "Juste avant de t'entraîner sur le mannequin — l'animateur t'accueille à la table."
  },

  pratique: {
    titre: "À toi de jouer",
    consigne: "<b>Entraîne-toi autant que tu veux</b> sur le mannequin. Vise le bon rythme et la bonne profondeur.",
    checklist: [
      "Mains au centre de la poitrine, bras tendus",
      "J'appuie fort (5 à 6 cm de profondeur)",
      "Rythme 100 à 120 par minute (« Stayin' Alive »)",
      "Je laisse la poitrine remonter entre chaque compression",
      "Je ne m'arrête pas"
    ],
    media: { type: "image", src: "", alt: "Personne s'entraînant au massage sur un mannequin" },
    validation: "Fais valider ton massage par l'animateur"
  },

  quiz: [
    { q: "Quel numéro appeler en premier ?", options: ["Le 15 ou le 112", "Le 17 (police)", "Aucun, je masse direct"], bonne: 0,
      explication: "Le 15 (SAMU) ou le 112 : on alerte d'abord, ou on fait appeler pendant qu'on masse." },
    { q: "À quel rythme masser ?", options: ["60 par minute", "100 à 120 par minute", "Le plus vite possible"], bonne: 1,
      explication: "Entre 100 et 120 compressions par minute — le tempo de « Stayin' Alive »." },
    { q: "Faut-il s'arrêter de masser ?", options: ["Oui, toutes les 2 minutes", "Non, jusqu'aux secours ou au défibrillateur", "Dès qu'on est fatigué"], bonne: 1,
      explication: "On ne s'arrête pas : chaque pause fait rechuter les chances de survie. On se relaie si on est plusieurs." }
  ],

  memo: {
    titre: "À retenir",
    points: [
      "Appeler le 15 (ou 112), masser, défibriller : les 3 gestes qui sauvent.",
      "Au centre de la poitrine, bras tendus, on appuie fort (5 à 6 cm).",
      "Rythme 100 à 120 par minute — le tempo de « Stayin' Alive ».",
      "On ne s'arrête pas jusqu'aux secours ou au défibrillateur.",
      "Un défibrillateur (DAE) parle et te guide : suis sa voix, tu ne peux pas te tromper."
    ]
  },

  sondage: [
    { q: "As-tu aimé l'atelier ?", type: "emoji", options: ["😍", "🙂", "😐"] },
    { q: "Te sens-tu capable de réagir face à un arrêt cardiaque ?", type: "choix", options: ["Oui", "Un peu", "Pas encore"] },
    { q: "Le geste t'a paru…", type: "choix", options: ["Facile", "Juste comme il faut", "Difficile"] },
    { q: "Un mot sur ton expérience ?", type: "texte" }
  ],

  fin: {
    badge: "🫀",
    titre: "Tu sais réagir !",
    message: "Bravo, tu connais maintenant les gestes qui peuvent sauver une vie. Parles-en autour de toi !",
    ctaHub: "Voir tous les ateliers",
    hubUrl: "../ateliers/"
  }
};
