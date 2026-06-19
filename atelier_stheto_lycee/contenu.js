/* ====================================================================
   CONTENU DE L'ATELIER STÉTHOSCOPE (auscultation + tension)
   En 2 parties : 1) les bruits du cœur  2) la prise de tension au brassard.
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
    phrase: "Ton cœur bat environ 100 000 fois par jour, sans jamais s'arrêter. Aujourd'hui, tu vas l'écouter battre et mesurer la tension, comme un médecin.",
    source: "",
    cta: "Je me lance",
    media: { type: "image", src: "", alt: "Stéthoscope et brassard de tension" }
  },

  pourquoi: {
    titre: "Pourquoi ce geste ?",
    points: [
      "Le stéthoscope amplifie les sons du corps : ici, le cœur, puis la tension artérielle.",
      "Écouter le cœur, c'est entendre la pompe qui te fait vivre.",
      "Avec un brassard, le même stéthoscope sert à mesurer la tension : un geste fait des millions de fois par jour dans le monde."
    ],
    media: { type: "video", src: "", label: "Cœur et tension expliqués (2 min)" }
  },

  geste: {
    titre: "Deux gestes à découvrir",
    materiel: ["Stéthoscope", "Brassard de tension (tensiomètre)", "Un binôme"],
    etapes: [
      { section: "Partie 1 · Les bruits du cœur" },
      { t: "Mettre les embouts", d: "Dans les oreilles, l'ouverture orientée vers l'avant. On utilise la grande membrane du pavillon." },
      { t: "Poser la membrane sur la peau", d: "Directement sur la peau, à gauche de la poitrine, jamais par-dessus les vêtements." },
      { t: "Écouter les deux bruits", d: "On entend le cœur faire « toc-toc » : ce sont ses deux bruits, à chaque battement." },
      { section: "Partie 2 · La tension au brassard" },
      { t: "Placer le brassard", d: "Autour du bras nu, juste au-dessus du pli du coude, bien ajusté." },
      { t: "Poser la membrane au pli du coude", d: "Sur l'intérieur du coude, là où passe l'artère." },
      { t: "Gonfler puis dégonfler doucement", d: "On gonfle le brassard, puis on laisse l'air repartir tout doucement en écoutant." },
      { t: "Lire les deux chiffres", d: "Le bruit qui apparaît = la tension haute ; le bruit qui disparaît = la tension basse." }
    ],
    media: { type: "video", src: "", label: "Ausculter et prendre la tension (2 min)" }
  },

  identification: {
    titre: "Dis-nous qui tu es",
    sousTitre: "Juste avant de prendre le stéthoscope — l'animateur t'accueille à la table."
  },

  pratique: {
    titre: "À toi de jouer",
    consigne: "<b>Deux gestes à essayer, à deux</b> : d'abord écouter le cœur, puis prendre la tension. En douceur sur ton binôme.",
    checklist: [
      "Embouts vers l'avant, membrane sur la peau (à gauche)",
      "Les deux bruits du cœur entendus",
      "Brassard placé sur le bras nu, au-dessus du coude",
      "Membrane posée au pli du coude, sur l'artère",
      "On gonfle, puis on dégonfle doucement",
      "On repère l'apparition (tension haute) et la disparition (tension basse) du bruit"
    ],
    media: { type: "image", src: "", alt: "Élève prenant la tension d'un binôme" },
    validation: "Fais valider tes deux gestes par l'animateur"
  },

  quiz: [
    { q: "Où pose-t-on la membrane pour écouter le cœur ?", options: ["Sur les vêtements", "Directement sur la peau, à gauche", "Dans le dos"], bonne: 1,
      explication: "Sur la peau, à gauche de la poitrine : les vêtements ajoutent des frottements et masquent les bruits." },
    { q: "Pour la tension, où place-t-on le brassard ?", options: ["Au poignet", "Autour du bras, au-dessus du coude", "Sur la poitrine"], bonne: 1,
      explication: "Le brassard se place autour du bras nu, juste au-dessus du pli du coude, et la membrane au pli du coude." },
    { q: "Quand on dégonfle, le bruit qui apparaît correspond à…", options: ["La tension haute", "La tension basse", "Rien du tout"], bonne: 0,
      explication: "Le premier bruit qui apparaît = la tension haute (systolique) ; quand le bruit disparaît = la tension basse (diastolique)." }
  ],

  memo: {
    titre: "À retenir",
    points: [
      "Embouts vers l'avant, membrane toujours sur la peau.",
      "Le cœur s'écoute à gauche de la poitrine (les deux bruits « toc-toc »).",
      "Pour la tension : brassard sur le bras nu, membrane au pli du coude.",
      "On gonfle, puis on dégonfle doucement en écoutant.",
      "Le bruit apparaît = tension haute ; le bruit disparaît = tension basse."
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
    message: "Bravo, tu viens d'écouter un cœur et de prendre une tension comme un médecin. Va débloquer les autres ateliers !",
    ctaHub: "Voir tous les ateliers",
    hubUrl: "../ateliers/"
  }
};
