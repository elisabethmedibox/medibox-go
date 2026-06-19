/* ====================================================================
   CONTENU DE L'ATELIER HEIMLICH (étouffement / désobstruction)
   Éditable via l'éditeur sans code (/ateliers/editeur.html?atelier=heimlich).
   Pour ajouter une photo / vidéo : coller une URL dans "src".
   ==================================================================== */
window.ATELIER_DATA = {
  slug: "atelier_heimlich_public",
  titre: "Heimlich",
  emoji: "🫁",
  public: "Grand public",
  famille: "geste-qui-sauve",

  accroche: {
    chiffre: ["3 500", "8 par jour"],
    phrase: "En France, près de 3 500 personnes meurent étouffées chaque année — plus de 8 par jour. Mais quelques gestes simples peuvent l'éviter. Aujourd'hui, tu les apprends.",
    source: "Santé publique France",
    cta: "Je me lance",
    media: { type: "image", src: "", alt: "Démonstration de la manœuvre de Heimlich" }
  },

  pourquoi: {
    titre: "Pourquoi ce geste ?",
    points: [
      "Un étouffement bloque l'arrivée d'air : sans réaction, la personne perd connaissance en quelques minutes.",
      "Les secours n'arrivent pas instantanément : c'est le témoin qui agit en premier.",
      "Bien fait, le geste peut expulser ce qui bloque et sauver la vie en quelques secondes."
    ],
    media: { type: "video", src: "", label: "Reconnaître un étouffement (2 min)" }
  },

  geste: {
    titre: "Que faire face à un étouffement",
    materiel: ["Gilet de démonstration Heimlich", "Un binôme (sauveteur + victime)"],
    etapes: [
      { t: "Reconnaître l'étouffement", d: "La personne porte les mains à sa gorge, le visage paniqué, ne peut plus parler." },
      { t: "Demander : « Vous vous étouffez ? »", d: "Si elle peut tousser, parler ou respirer : on l'encourage à tousser, on ne tape pas." },
      { t: "5 claques dans le dos", d: "Si elle ne peut plus respirer : penche-la en avant et donne 5 claques vigoureuses entre les omoplates, avec le plat de la main." },
      { t: "5 compressions abdominales", d: "Si ça ne suffit pas : place-toi derrière, un poing au creux de l'estomac (au-dessus du nombril), l'autre main par-dessus, et tire vers toi et vers le haut." },
      { t: "Alterner 5 et 5", d: "On alterne 5 claques dans le dos et 5 compressions abdominales jusqu'à ce que ce qui bloque soit expulsé." },
      { t: "Si elle perd connaissance", d: "On l'allonge doucement, on appelle le 15 (ou 112) et on commence le massage cardiaque." }
    ],
    media: { type: "video", src: "", label: "Claques dans le dos + Heimlich (2 min)" }
  },

  identification: {
    titre: "Dis-nous qui tu es",
    sousTitre: "Juste avant de t'entraîner avec le gilet — l'animateur t'accueille à la table."
  },

  pratique: {
    titre: "À toi de jouer",
    consigne: "<b>Entraîne-toi à deux</b> avec le gilet de démonstration : repère le bon endroit et le bon mouvement, sans forcer sur ton binôme.",
    checklist: [
      "On demande d'abord « vous vous étouffez ? »",
      "Si la personne tousse : on l'encourage, on ne tape pas",
      "5 claques entre les omoplates, personne penchée en avant",
      "Poing au creux de l'estomac, au-dessus du nombril",
      "On tire vers soi et vers le haut",
      "On alterne 5 claques / 5 compressions"
    ],
    media: { type: "image", src: "", alt: "Entraînement au geste avec le gilet de démonstration" },
    validation: "Fais valider ton geste par l'animateur"
  },

  quiz: [
    { q: "Si la personne peut encore tousser, que fait-on ?", options: ["On l'encourage à tousser", "On tape tout de suite dans le dos", "On fait Heimlich"], bonne: 0,
      explication: "Tant qu'elle tousse, l'air passe encore : la toux est le geste le plus efficace, on ne fait rien d'autre que l'encourager." },
    { q: "Par quoi commence-t-on quand elle ne respire plus ?", options: ["5 claques dans le dos", "Les compressions abdominales", "Le massage cardiaque"], bonne: 0,
      explication: "On commence par 5 claques dans le dos ; on passe aux compressions abdominales (Heimlich) seulement si les claques ne suffisent pas." },
    { q: "Où place-t-on le poing pour les compressions ?", options: ["Sur la poitrine", "Au creux de l'estomac, au-dessus du nombril", "En bas du ventre"], bonne: 1,
      explication: "Le poing se place au creux de l'estomac, juste au-dessus du nombril, et on tire vers soi et vers le haut." }
  ],

  memo: {
    titre: "À retenir",
    points: [
      "On demande d'abord : « Vous vous étouffez ? »",
      "Si la personne tousse ou parle : on l'encourage à tousser, on ne tape pas.",
      "Si elle ne respire plus : 5 claques dans le dos, puis 5 compressions abdominales.",
      "On alterne 5 et 5 jusqu'à expulsion.",
      "Si elle perd connaissance : on appelle le 15 (ou 112) et on masse."
    ]
  },

  sondage: [
    { q: "As-tu aimé l'atelier ?", type: "emoji", options: ["😍", "🙂", "😐"] },
    { q: "Te sens-tu capable de réagir face à un étouffement ?", type: "choix", options: ["Oui", "Un peu", "Pas encore"] },
    { q: "Le geste t'a paru…", type: "choix", options: ["Facile", "Juste comme il faut", "Difficile"] },
    { q: "Un mot sur ton expérience ?", type: "texte" }
  ],

  fin: {
    badge: "🆘",
    titre: "Tu sais réagir !",
    message: "Bravo, tu connais maintenant les gestes face à un étouffement. Parles-en autour de toi !",
    ctaHub: "Voir tous les ateliers",
    hubUrl: "../ateliers/"
  }
};
