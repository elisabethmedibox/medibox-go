/* ====================================================================
   CONTENU DE L'ATELIER SUTURE
   Ce fichier est édité via l'éditeur sans code (/ateliers/editeur.html)
   ou à la main : on ne change que le texte entre guillemets.
   Pour ajouter une photo / vidéo : coller une URL dans "src".
   ==================================================================== */
window.ATELIER_DATA = {
  slug: "atelier_suture_lycee",
  titre: "Suture",
  emoji: "🪡",
  public: "Lycée",
  famille: "decouverte",

  accroche: {
    chiffre: "1 plaie sur 3",
    phrase: "Aux urgences, 1 plaie sur 3 est refermée avec des points de suture. Aujourd'hui, c'est toi qui tiens l'aiguille.",
    source: "Enquête nationale SFMU / SFFPC, 2017",
    cta: "Je me lance",
    media: { type: "image", src: "", alt: "Aiguille montée sur un porte-aiguille" }
  },

  pourquoi: {
    titre: "Pourquoi ce geste ?",
    points: [
      "Suturer, c'est refermer une plaie pour qu'elle cicatrise vite et proprement.",
      "C'est l'un des premiers gestes techniques que tout médecin apprend.",
      "Bien fait : moins de risque d'infection et une cicatrice plus discrète."
    ],
    media: { type: "video", src: "", label: "À quoi sert une suture ? (2 min)" }
  },

  geste: {
    titre: "Le geste expliqué",
    introMedia: { type: "video", src: "", label: "En vidéo (2 min)" },
    materiel: ["Porte-aiguille", "Pince à disséquer", "Fil + aiguille courbe", "Pad d'entraînement", "Ciseaux"],
    etapes: [
      { t: "Charger l'aiguille", d: "On la serre dans le porte-aiguille, aux 2/3 de sa courbe." },
      { t: "Piquer perpendiculairement", d: "On entre à 90° dans la peau, à environ 5 mm du bord de la plaie." },
      { t: "Tourner le poignet", d: "On suit la courbe de l'aiguille — on ne pousse jamais tout droit." },
      { t: "Ressortir symétriquement", d: "De l'autre côté, à la même distance du bord." },
      { t: "Faire le nœud du chirurgien", d: "2 boucles, puis 1, puis 1 (environ 3 nœuds qui tiennent)." },
      { t: "Couper les brins", d: "On laisse ~5 mm. Les berges sont affrontées, sans trop serrer." }
    ],
    media: { type: "video", src: "", label: "Le point simple, pas à pas (2 min)" }
  },

  identification: {
    titre: "Dis-nous qui tu es",
    sousTitre: "Juste avant de prendre l'aiguille — l'animateur t'accueille à la table."
  },

  pratique: {
    titre: "À toi de jouer",
    consigne: "<b>Fais-en autant que tu veux</b>, c'est fait pour s'entraîner. Espace tes points d'environ <b>1 cm</b>.",
    checklist: [
      "Aiguille chargée aux 2/3 du porte-aiguille",
      "Entrée perpendiculaire, à ~5 mm du bord",
      "Rotation du poignet pour suivre la courbe",
      "Sortie symétrique de l'autre côté",
      "Berges affrontées, sans trop serrer",
      "Nœud du chirurgien (≈ 3 nœuds)",
      "Points espacés d'environ 1 cm"
    ],
    media: { type: "image", src: "", alt: "Élève en train de suturer sur le pad" },
    validation: "Fais valider ton geste par l'animateur"
  },

  quiz: [
    { q: "À quelle distance du bord pique-t-on ?", options: ["2 mm", "5 mm", "1 cm"], bonne: 1,
      explication: "On entre à environ 5 mm du bord pour une bonne tenue sans abîmer la peau." },
    { q: "Comment fait-on avancer l'aiguille ?", options: ["On pousse tout droit", "On tourne le poignet"], bonne: 1,
      explication: "L'aiguille est courbe : on suit sa courbure en tournant le poignet." },
    { q: "Pourquoi ne pas trop serrer le nœud ?", options: ["C'est plus joli", "Ça étrangle les berges et gêne la cicatrisation", "Ça va plus vite"], bonne: 1,
      explication: "Un nœud trop serré comprime la peau, l'abîme et ralentit la cicatrisation." }
  ],

  memo: {
    titre: "À retenir",
    points: [
      "On pique perpendiculairement, à ~5 mm du bord.",
      "On tourne le poignet, on ne force jamais tout droit.",
      "Entrée et sortie symétriques de chaque côté.",
      "Nœud du chirurgien = environ 3 nœuds qui tiennent.",
      "Berges affrontées, jamais serrées, points espacés d'~1 cm."
    ]
  },

  sondage: [
    { q: "As-tu aimé l'atelier ?", type: "emoji", options: ["😍", "🙂", "😐"] },
    { q: "Ça t'a donné envie d'en savoir plus sur la médecine ?", type: "choix", options: ["Oui", "Peut-être", "Non"] },
    { q: "Le geste t'a paru…", type: "choix", options: ["Facile", "Juste comme il faut", "Difficile"] },
    { q: "Un mot sur ton expérience ?", type: "texte" }
  ],

  fin: {
    badge: "🥇",
    titre: "Suture validée !",
    message: "Bravo, tu viens de réaliser un vrai geste de médecin. Va débloquer les autres ateliers !",
    ctaHub: "Voir tous les ateliers",
    hubUrl: "../ateliers/"
  }
};
