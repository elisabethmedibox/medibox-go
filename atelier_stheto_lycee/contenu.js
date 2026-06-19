/* ====================================================================
   CONTENU DE L'ATELIER STÉTHOSCOPE (auscultation)
   Éditable via l'éditeur sans code (/ateliers/editeur.html?atelier=stheto).
   Pour ajouter une photo / vidéo : coller une URL dans "src".
   ==================================================================== */
window.ATELIER_DATA = {
  slug: "atelier_stheto_lycee",
  titre: "Stéthoscope",
  emoji: "🩺",
  public: "Lycée",
  famille: "decouverte",

  accroche: {
    chiffre: ["100 000 fois"],
    phrase: "Ton cœur bat environ 100 000 fois par jour, sans jamais s'arrêter. Avec un stéthoscope, tu vas l'écouter battre.",
    source: "",
    cta: "Je me lance",
    media: { type: "image", src: "", alt: "Stéthoscope posé sur une table" }
  },

  pourquoi: {
    titre: "Pourquoi ce geste ?",
    points: [
      "Le stéthoscope amplifie les sons du corps : le cœur, les poumons, parfois le ventre.",
      "C'est le geste de base du médecin pour repérer un souffle, une respiration anormale.",
      "Pas besoin d'appareil compliqué : une membrane, deux tuyaux, et de l'attention."
    ],
    media: { type: "video", src: "", label: "Comment marche un stéthoscope (2 min)" }
  },

  geste: {
    titre: "Le geste expliqué",
    materiel: ["Stéthoscope", "Un binôme"],
    etapes: [
      { t: "Mettre les embouts", d: "On place les embouts dans les oreilles, l'ouverture orientée vers l'avant." },
      { t: "Choisir la grande membrane", d: "On utilise le grand côté du pavillon (la membrane) pour les sons courants." },
      { t: "Poser sur la peau", d: "On pose la membrane directement sur la peau, jamais par-dessus les vêtements." },
      { t: "Écouter le cœur", d: "Sur le côté gauche de la poitrine : on entend les deux bruits, « toc-toc »." },
      { t: "Écouter les poumons", d: "Dans le dos : on demande à la personne de respirer fort par la bouche." }
    ],
    media: { type: "video", src: "", label: "Ausculter pas à pas (2 min)" }
  },

  identification: {
    titre: "Dis-nous qui tu es",
    sousTitre: "Juste avant de prendre le stéthoscope — l'animateur t'accueille à la table."
  },

  pratique: {
    titre: "À toi de jouer",
    consigne: "<b>Écoute à deux</b> : un « patient », un « examinateur ». Pose bien la membrane sur la peau et tends l'oreille.",
    checklist: [
      "Embouts orientés vers l'avant dans les oreilles",
      "Membrane posée sur la peau, pas sur les vêtements",
      "Cœur écouté à gauche de la poitrine (les deux bruits)",
      "Poumons écoutés dans le dos, pendant une grande respiration"
    ],
    media: { type: "image", src: "", alt: "Élève auscultant un binôme au stéthoscope" },
    validation: "Fais valider ton auscultation par l'animateur"
  },

  quiz: [
    { q: "Où pose-t-on la membrane du stéthoscope ?", options: ["Sur les vêtements", "Directement sur la peau", "Peu importe"], bonne: 1,
      explication: "On pose toujours la membrane sur la peau : les vêtements ajoutent des frottements et masquent les sons." },
    { q: "Comment orienter les embouts dans les oreilles ?", options: ["Vers l'avant", "Vers l'arrière", "Peu importe"], bonne: 0,
      explication: "Les embouts s'orientent vers l'avant, dans l'axe du conduit auditif, pour bien entendre." },
    { q: "Pour écouter les poumons, on demande de…", options: ["Retenir sa respiration", "Respirer fort par la bouche", "Parler"], bonne: 1,
      explication: "On demande de respirer fort par la bouche : ça fait circuler l'air et rend les bruits audibles." }
  ],

  memo: {
    titre: "À retenir",
    points: [
      "Embouts orientés vers l'avant dans les oreilles.",
      "On pose la membrane sur la peau, jamais sur les vêtements.",
      "Le cœur s'écoute à gauche de la poitrine (les deux bruits).",
      "Les poumons s'écoutent dans le dos, en respirant fort par la bouche.",
      "Un endroit calme aide beaucoup à entendre."
    ]
  },

  sondage: [
    { q: "As-tu aimé l'atelier ?", type: "emoji", options: ["😍", "🙂", "😐"] },
    { q: "Ça t'a donné envie d'en savoir plus sur la médecine ?", type: "choix", options: ["Oui", "Peut-être", "Non"] },
    { q: "Le geste t'a paru…", type: "choix", options: ["Facile", "Juste comme il faut", "Difficile"] },
    { q: "Un mot sur ton expérience ?", type: "texte" }
  ],

  fin: {
    badge: "🩺",
    titre: "Auscultation validée !",
    message: "Bravo, tu viens d'écouter un cœur comme un médecin. Va débloquer les autres ateliers !",
    ctaHub: "Voir tous les ateliers",
    hubUrl: "../ateliers/"
  }
};
