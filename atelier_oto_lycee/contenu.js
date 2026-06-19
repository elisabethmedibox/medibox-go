/* ====================================================================
   CONTENU DE L'ATELIER OTOSCOPE (examen de l'oreille)
   Éditable via l'éditeur sans code (/ateliers/editeur.html?atelier=oto).
   Pour ajouter une photo / vidéo : coller une URL dans "src".
   ==================================================================== */
window.ATELIER_DATA = {
  slug: "atelier_oto_lycee",
  titre: "Otoscope",
  emoji: "👂",
  public: "Lycée",
  famille: "decouverte",

  accroche: {
    chiffre: ["1 cm"],
    phrase: "Le tympan, c'est une fine membrane d'à peine 1 cm qui vibre pour te faire entendre le monde. Aujourd'hui, tu vas l'observer comme un médecin.",
    source: "",
    cta: "Je me lance",
    media: { type: "image", src: "", alt: "Otoscope et embout à usage unique" }
  },

  pourquoi: {
    titre: "Pourquoi ce geste ?",
    points: [
      "L'otoscope éclaire et grossit l'intérieur de l'oreille pour voir le tympan.",
      "C'est le geste de base pour dépister une otite, un bouchon de cérumen, une infection.",
      "Un médecin le fait dès qu'on se plaint d'une oreille : tu vas voir comme lui."
    ],
    media: { type: "video", src: "", label: "L'oreille et le tympan (2 min)" }
  },

  geste: {
    titre: "Le geste expliqué",
    materiel: ["Otoscope", "Embouts à usage unique", "Oreille de démonstration ou un binôme"],
    etapes: [
      { t: "Préparer l'otoscope", d: "On l'allume et on met un embout propre (à usage unique) au bout." },
      { t: "Redresser le conduit", d: "On tire doucement le pavillon de l'oreille vers le haut et l'arrière : ça aligne le conduit." },
      { t: "Introduire sans forcer", d: "On glisse délicatement l'embout dans l'entrée du conduit, jamais en forçant." },
      { t: "Chercher le tympan", d: "On regarde dans l'otoscope : le tympan est une membrane nacrée, légèrement translucide." },
      { t: "Repérer le triangle lumineux", d: "Sur un tympan sain, la lumière dessine un petit reflet en triangle : bon signe." }
    ],
    media: { type: "video", src: "", label: "Utiliser un otoscope pas à pas (2 min)" }
  },

  identification: {
    titre: "Dis-nous qui tu es",
    sousTitre: "Juste avant de prendre l'otoscope — l'animateur t'accueille à la table."
  },

  pratique: {
    titre: "À toi de jouer",
    consigne: "<b>Observe à deux</b> : un « patient », un « examinateur ». Vas-y tout en douceur, on n'enfonce jamais l'embout.",
    checklist: [
      "Embout propre en place sur l'otoscope",
      "Pavillon tiré vers le haut et l'arrière",
      "Embout introduit sans forcer",
      "Tympan repéré (nacré, translucide)",
      "Triangle lumineux repéré"
    ],
    media: { type: "image", src: "", alt: "Élève observant une oreille à l'otoscope" },
    validation: "Fais valider ton observation par l'animateur"
  },

  quiz: [
    { q: "Pourquoi tire-t-on le pavillon de l'oreille ?", options: ["Pour redresser le conduit", "Pour faire moins mal", "Pour mieux tenir l'otoscope"], bonne: 0,
      explication: "Le conduit est coudé : tirer le pavillon vers le haut et l'arrière l'aligne pour voir le tympan." },
    { q: "À quoi ressemble un tympan sain ?", options: ["Rouge vif", "Nacré et légèrement translucide", "Tout noir"], bonne: 1,
      explication: "Un tympan sain est nacré, un peu translucide, avec un petit triangle lumineux. Rouge = souvent une infection." },
    { q: "Que ne faut-il jamais faire ?", options: ["Enfoncer l'embout en forçant", "Mettre un embout propre", "Tirer doucement le pavillon"], bonne: 0,
      explication: "On n'enfonce jamais l'embout en forçant : on reste à l'entrée du conduit, en douceur." }
  ],

  memo: {
    titre: "À retenir",
    points: [
      "Toujours un embout propre, à usage unique.",
      "On tire le pavillon vers le haut et l'arrière pour redresser le conduit.",
      "On introduit l'embout en douceur, jamais en forçant.",
      "Le tympan sain est nacré et translucide, avec un triangle lumineux.",
      "Rouge ou bombé : signe d'une possible otite."
    ]
  },

  sondage: [
    { q: "As-tu aimé l'atelier ?", type: "emoji", options: ["😍", "🙂", "😐"] },
    { q: "Ça t'a donné envie d'en savoir plus sur la médecine ?", type: "choix", options: ["Oui", "Peut-être", "Non"] },
    { q: "Le geste t'a paru…", type: "choix", options: ["Facile", "Juste comme il faut", "Difficile"] },
    { q: "Un mot sur ton expérience ?", type: "texte" }
  ],

  fin: {
    badge: "👂",
    titre: "Otoscopie validée !",
    message: "Bravo, tu viens de regarder une oreille comme un médecin. Va débloquer les autres ateliers !",
    ctaHub: "Voir tous les ateliers",
    hubUrl: "../ateliers/"
  }
};
