/* ====================================================================
   CONTENU DE L'ATELIER STÉTHOSCOPE (auscultation cardiaque + tension)
   En 2 parties : 1) les bruits du cœur (B1/B2, 4 foyers)
                  2) la tension au brassard (Korotkoff, PAS/PAD).
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
    phrase: "Ton cœur bat environ 100 000 fois par jour, sans jamais s'arrêter. Aujourd'hui, tu vas l'ausculter et mesurer la tension, comme un médecin.",
    source: "",
    cta: "Je me lance",
    media: { type: "image", src: "", alt: "Stéthoscope et tensiomètre à brassard" }
  },

  pourquoi: {
    titre: "Pourquoi ce geste ?",
    points: [
      "Le stéthoscope amplifie les sons du corps : ici, les bruits du cœur et le passage du sang dans l'artère.",
      "Bien ausculté, le cœur révèle ses valves : un souffle anormal peut trahir une maladie.",
      "Avec un brassard, on mesure la tension artérielle — un dépistage simple et essentiel de l'hypertension."
    ],
    media: { type: "video", src: "", label: "Le cœur, les valves et la tension (2 min)" }
  },

  geste: {
    titre: "Deux gestes à découvrir",
    materiel: ["Stéthoscope", "Tensiomètre à brassard (manuel)", "Un binôme"],
    etapes: [
      { section: "Partie 1 · Les bruits du cœur" },
      { t: "Installer le stéthoscope", d: "Embouts dans les oreilles, orientés vers l'avant ; on pose la grande membrane directement sur la peau." },
      { t: "Entendre B1 et B2", d: "À chaque battement, deux bruits. B1 = fermeture des valves mitrale et tricuspide, c'est le début de la systole (le cœur se contracte et éjecte le sang). B2 = fermeture des valves aortique et pulmonaire, c'est le début de la diastole (le cœur se relâche et se remplit).", media: { type: "image", src: "", alt: "Les bruits du cœur B1 et B2 dans le cycle cardiaque" } },
      { t: "Foyer aortique", d: "En haut à droite du sternum (2e espace entre les côtes) : on y écoute la valve aortique. B2 y est bien net." },
      { t: "Foyer pulmonaire", d: "En haut à gauche du sternum (2e espace) : on y écoute la valve pulmonaire." },
      { t: "Foyer tricuspide", d: "En bas du sternum, du côté gauche : on y écoute la valve tricuspide." },
      { t: "Foyer mitral", d: "À la pointe du cœur, sous le sein gauche (5e espace, ligne du milieu de la clavicule) : on y écoute la valve mitrale. B1 y est le plus franc.", media: { type: "video", src: "", label: "Repérer le foyer mitral (2 min)" } },
      { section: "Partie 2 · La tension au brassard" },
      { t: "Placer le brassard et la membrane", d: "Brassard autour du bras nu, juste au-dessus du coude ; membrane du stéthoscope au pli du coude, sur l'artère.", media: { type: "image", src: "", alt: "Brassard et stéthoscope placés au pli du coude" } },
      { t: "Gonfler au-dessus de la tension", d: "On gonfle jusqu'à comprimer complètement l'artère : le sang ne passe plus, on n'entend rien." },
      { t: "1er bruit de Korotkoff = PAS", d: "On dégonfle tout doucement. Dès que le sang force le passage, un bruit réapparaît : c'est la PAS, pression artérielle systolique — la pression maximale, quand le cœur se contracte." },
      { t: "Disparition du bruit = PAD", d: "On continue à dégonfler. Quand le bruit disparaît complètement, c'est la PAD, pression artérielle diastolique — la pression minimale, quand le cœur se relâche entre deux battements." },
      { t: "Lire la tension", d: "On note les deux chiffres, PAS / PAD (par exemple 120/80 mmHg). Ce sont les bruits de Korotkoff qui les révèlent." }
    ],
    media: { type: "video", src: "", label: "Ausculter le cœur et prendre la tension (2 min)" }
  },

  identification: {
    titre: "Dis-nous qui tu es",
    sousTitre: "Juste avant de prendre le stéthoscope — l'animateur t'accueille à la table."
  },

  pratique: {
    titre: "À toi de jouer",
    consigne: "<b>Deux gestes à essayer, à deux</b> : ausculter le cœur sur les 4 foyers, puis prendre la tension. En douceur et au calme — c'est plus facile d'entendre.",
    checklist: [
      "Embouts vers l'avant, membrane sur la peau",
      "J'écoute les 4 foyers : aortique, pulmonaire, tricuspide, mitral",
      "Je distingue B1 (systole) et B2 (diastole)",
      "Brassard sur le bras nu, membrane au pli du coude",
      "Je gonfle au-dessus de la tension, puis je dégonfle doucement",
      "1er bruit = PAS, disparition = PAD ; je note PAS / PAD"
    ],
    media: { type: "image", src: "", alt: "Élève prenant la tension d'un binôme" },
    video: { type: "video", src: "", label: "La pratique en vidéo (2 min)" },
    validation: "Fais valider tes deux gestes par l'animateur"
  },

  quiz: [
    { q: "Le premier bruit du cœur (B1) correspond à…", options: ["La fermeture des valves mitrale et tricuspide", "L'ouverture de l'aorte", "Le remplissage du cœur"], bonne: 0,
      explication: "B1 = fermeture des valves mitrale et tricuspide : il marque le début de la systole, quand le cœur se contracte pour éjecter le sang." },
    { q: "Où se trouve le foyer mitral ?", options: ["À la pointe du cœur, sous le sein gauche", "En haut à droite du sternum", "Dans le dos"], bonne: 0,
      explication: "Le foyer mitral est à la pointe du cœur (5e espace intercostal, ligne médio-claviculaire), sous le sein gauche." },
    { q: "Quand on dégonfle, le 1er bruit de Korotkoff donne…", options: ["La PAS (pression maximale, systole)", "La PAD (pression minimale)", "La fréquence cardiaque"], bonne: 0,
      explication: "Le premier bruit qui réapparaît correspond à la PAS, la pression artérielle systolique : la pression la plus haute, au moment où le cœur se contracte." },
    { q: "La PAD correspond à quel moment ?", options: ["La disparition du bruit, pression minimale", "Le premier bruit, pression maximale", "Le milieu du dégonflage"], bonne: 0,
      explication: "La PAD (pression artérielle diastolique) se lit quand le bruit disparaît : c'est la pression minimale, quand le cœur se relâche entre deux battements." }
  ],

  memo: {
    titre: "À retenir",
    points: [
      "Le cœur s'ausculte en 4 foyers : aortique, pulmonaire, tricuspide, mitral — un par valve.",
      "B1 = fermeture mitrale + tricuspide (début de la systole) ; B2 = fermeture aortique + pulmonaire (début de la diastole).",
      "Tension : on écoute les bruits de Korotkoff au pli du coude pendant qu'on dégonfle.",
      "1er bruit = PAS (pression systolique, maximale, cœur qui se contracte).",
      "Disparition du bruit = PAD (pression diastolique, minimale, cœur au repos). Une tension normale tourne autour de 120/80."
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
    message: "Bravo, tu viens d'ausculter un cœur et de mesurer une tension comme un médecin. Va débloquer les autres ateliers !",
    ctaHub: "Voir tous les ateliers",
    hubUrl: "../ateliers/"
  }
};
