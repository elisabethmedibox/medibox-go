/* Moteur d'atelier MediBox — rend le parcours depuis window.ATELIER_DATA.
   Front uniquement pour l'instant : identité + sondage stockés en localStorage, aucune écriture serveur. */
(function () {
  "use strict";

  function start() {
  var D = window.ATELIER_DATA;
  var root = document.getElementById("atelier");
  if (!D || !root) {
    if (root) root.innerHTML = '<p style="padding:24px">Données de l\'atelier manquantes (ATELIER_DATA).</p>';
    return;
  }
  document.title = "Atelier " + D.titre + " · MediBox Antilles-Guyane";

  /* --- état --- */
  var state = { ident: {}, quiz: [], sondage: {} };

  /* --- helpers --- */
  function esc(s) { return (s == null ? "" : String(s)).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function mediaSlot(m) {
    if (!m) return "";
    if (m.type === "video") {
      if (m.src) {
        var emb = toEmbed(m.src);
        if (emb) return '<div class="media video-link"><div class="vembed"><iframe src="' + esc(emb) +
          '" allowfullscreen loading="lazy" title="' + esc(m.label || "Vidéo") + '"></iframe></div></div>';
        return '<div class="media video-link"><a class="vbtn" href="' + esc(m.src) +
          '" target="_blank" rel="noopener">▶ ' + esc(m.label || "Regarder la vidéo") + "</a></div>";
      }
      return '<div class="media video-link"><i>▶</i><div class="mt"><b>Vidéo ' +
        esc(m.label || "(2 min)") + "</b><br>emplacement à remplir</div></div>";
    }
    // image
    if (m.src) return '<div class="media"><img src="' + esc(m.src) + '" alt="' + esc(m.alt || "") + '"></div>';
    return '<div class="media"><i>🖼️</i><div class="mt"><b>Photo</b><br>' +
      esc(m.alt || "emplacement à remplir") + "</div></div>";
  }

  function highlightChiffres(phrase, chiffre) {
    // chiffre peut être une chaîne OU un tableau de chaînes à mettre en valeur
    var list = Array.isArray(chiffre) ? chiffre : (chiffre ? [chiffre] : []);
    var out = phrase;
    list.forEach(function (c) {
      if (c) out = out.replace(c, '<span class="hl">' + c + "</span>");
    });
    return out;
  }

  function toEmbed(url) {
    var yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (yt) return "https://www.youtube.com/embed/" + yt[1];
    var vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return "https://player.vimeo.com/video/" + vm[1];
    return null;
  }

  /* --- construction des écrans --- */
  var steps = [];

  // 1. Accroche
  steps.push({ key: "accroche", html: function () {
    var a = D.accroche;
    return '<span class="pub-pill">' + esc(D.public) + '</span>' +
      '<div class="eyebrow">' + esc(D.emoji) + " Atelier " + esc(D.titre) + "</div>" +
      '<h1 class="big">' + highlightChiffres(a.phrase, a.chiffre) + "</h1>" +
      mediaSlot(a.media) +
      (a.source ? '<div class="source">Source : ' + esc(a.source) + "</div>" : "");
  }, cta: function () { return D.accroche.cta || "Je me lance"; } });

  // 2. Pourquoi
  steps.push({ key: "pourquoi", html: function () {
    var p = D.pourquoi;
    return '<h2 class="scr">' + esc(p.titre) + "</h2>" +
      "<ul class=\"bullets\">" + p.points.map(function (t, i) {
        return '<li><span class="ic">' + (i + 1) + "</span><span>" + esc(t) + "</span></li>"; }).join("") + "</ul>" +
      mediaSlot(p.media);
  } });

  // 3. Le geste
  steps.push({ key: "geste", html: function () {
    var g = D.geste;
    var mat = g.materiel ? '<div class="materiel">' + g.materiel.map(function (m) {
      return "<span>" + esc(m) + "</span>"; }).join("") + "</div>" : "";
    var et = g.etapes.map(function (e, i) {
      return '<div class="etape"><div class="num">' + (i + 1) + '</div><div><div class="et-t">' +
        esc(e.t) + '</div><div class="et-d">' + esc(e.d) + "</div>" +
        (e.media ? mediaSlot(e.media) : "") + "</div></div>"; }).join("");
    return '<h2 class="scr">' + esc(g.titre) + "</h2>" + mat + et + mediaSlot(g.media);
  } });

  // 4. Identification
  steps.push({ key: "ident", html: function () {
    var f = D.identification;
    var interet = '<div class="form-grp"><label>Intéressé.e par des études de santé ?</label>' +
      '<div class="seg" data-seg="interet">' +
      ["Oui", "Peut-être", "Non"].map(function (o) {
        return '<button type="button" data-val="' + o + '">' + o + "</button>"; }).join("") + "</div></div>";
    return '<div class="eyebrow">On passe à la pratique</div>' +
      '<h2 class="scr">' + esc(f.titre || "Dis-nous qui tu es") + "</h2>" +
      (f.sousTitre ? '<p class="lead" style="margin-bottom:18px">' + esc(f.sousTitre) + "</p>" : "") +
      '<div class="form-grp"><label>Prénom</label><input id="f-prenom" placeholder="Ton prénom" autocomplete="given-name"></div>' +
      '<div class="form-grp"><label>Lycée ou situation actuelle</label><input id="f-lycee" placeholder="Lycée, ou ce que tu fais actuellement"></div>' +
      '<div class="form-grp"><label>Classe ou niveau d\'étude</label><input id="f-classe" placeholder="Ex. Terminale, ou ton niveau d\'étude"></div>' +
      '<div class="form-grp"><label>E-mail</label><input id="f-email" type="email" placeholder="pour recevoir le mémo" inputmode="email"></div>' +
      interet;
  }, onEnter: function (scr) {
    var pr = scr.querySelector("#f-prenom");
    pr.addEventListener("input", function () {
      state.ident.prenom = pr.value.trim(); refreshCta();
    });
    ["lycee", "classe", "email"].forEach(function (k) {
      scr.querySelector("#f-" + k).addEventListener("input", function (e) { state.ident[k] = e.target.value.trim(); refreshCta(); });
    });
    scr.querySelectorAll('[data-seg="interet"] button').forEach(function (b) {
      b.addEventListener("click", function () {
        scr.querySelectorAll('[data-seg="interet"] button').forEach(function (x) { x.classList.remove("sel"); });
        b.classList.add("sel"); state.ident.interet = b.dataset.val; refreshCta();
      });
    });
    setBadge("en_cours");
  }, canContinue: function () {
    var d = state.ident;
    return !!(d.prenom && d.lycee && d.classe && d.email && /.+@.+\..+/.test(d.email) && d.interet);
  },
     cta: function () { return "Commencer l'atelier"; } });

  // 5. Pratique (checklist + validation animateur)
  steps.push({ key: "pratique", html: function () {
    var p = D.pratique;
    var items = p.checklist.map(function (c, i) {
      return '<div class="check" data-i="' + i + '"><span class="box">✓</span><span>' + esc(c) + "</span></div>"; }).join("");
    return '<h2 class="scr">' + esc(p.titre || "À toi de jouer") + "</h2>" +
      '<div class="consigne">' + p.consigne + "</div>" +
      items + (p.media ? mediaSlot(p.media) : "") +
      '<button type="button" class="valid-anim" id="valid-anim">' + esc(p.validation || "Fais valider ton geste par l'animateur") + "</button>";
  }, onEnter: function (scr) {
    scr.querySelectorAll(".check").forEach(function (row) {
      row.addEventListener("click", function () { row.classList.toggle("on"); });
    });
    var vb = scr.querySelector("#valid-anim");
    vb.addEventListener("click", function () {
      vb.classList.add("done"); vb.textContent = "✓ Geste validé par l'animateur";
      state.valide = true; refreshCta();
    });
  }, canContinue: function () { return !!state.valide; } });

  // 6. Quiz
  steps.push({ key: "quiz", html: function () { return '<div id="quiz-host"></div>'; },
    onEnter: function (scr) { runQuiz(scr.querySelector("#quiz-host")); },
    canContinue: function () { return state.quiz.length >= D.quiz.length; } });

  // 7. Mémo
  steps.push({ key: "memo", html: function () {
    var m = D.memo;
    return '<h2 class="scr">' + esc(m.titre || "À retenir") + " 📌</h2>" +
      '<div class="memo-card"><ul>' + m.points.map(function (t) {
        return '<li><span class="ck">✓</span><span>' + esc(t) + "</span></li>"; }).join("") + "</ul></div>" +
      '<div class="memo-tip">Prends-le en photo avant de continuer !</div>';
  }, cta: function () { return "Donner mon avis"; } });

  // 8. Sondage
  steps.push({ key: "sondage", html: function () {
    var html = '<h2 class="scr">Ton avis nous aide ✨</h2>';
    D.sondage.forEach(function (q, i) {
      html += '<div class="sond-q" data-q="' + i + '"><div class="sq">' + esc(q.q) + "</div>";
      if (q.type === "emoji") {
        html += '<div class="emoji-row">' + q.options.map(function (o) {
          return '<button type="button" data-val="' + esc(o) + '">' + esc(o) + "</button>"; }).join("") + "</div>";
      } else if (q.type === "texte") {
        html += '<textarea placeholder="(facultatif)"></textarea>';
      } else {
        html += '<div class="seg">' + q.options.map(function (o) {
          return '<button type="button" data-val="' + esc(o) + '">' + esc(o) + "</button>"; }).join("") + "</div>";
      }
      html += "</div>";
    });
    return html;
  }, onEnter: function (scr) {
    scr.querySelectorAll(".sond-q").forEach(function (block) {
      var qi = block.dataset.q;
      block.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
          block.querySelectorAll("button").forEach(function (x) { x.classList.remove("sel"); });
          b.classList.add("sel"); state.sondage[qi] = b.dataset.val;
        });
      });
      var ta = block.querySelector("textarea");
      if (ta) ta.addEventListener("input", function () { state.sondage[qi] = ta.value; });
    });
  }, cta: function () { return "Terminer"; }, last: true });

  /* --- quiz interne (une question à la fois) --- */
  function runQuiz(host) {
    var qi = 0;
    function render() {
      var q = D.quiz[qi];
      host.innerHTML = '<div class="qcount">Question ' + (qi + 1) + " / " + D.quiz.length + "</div>" +
        '<h2 class="scr">' + esc(q.q) + "</h2>" +
        q.options.map(function (o, i) {
          return '<button type="button" class="q-opt" data-i="' + i + '">' + esc(o) + "<span></span></button>"; }).join("") +
        '<div id="q-explain"></div>';
      host.querySelectorAll(".q-opt").forEach(function (btn) {
        btn.addEventListener("click", function () { answer(parseInt(btn.dataset.i, 10)); });
      });
    }
    function answer(i) {
      var q = D.quiz[qi];
      state.quiz[qi] = i;
      host.querySelectorAll(".q-opt").forEach(function (btn, idx) {
        btn.disabled = true;
        if (idx === q.bonne) btn.classList.add("good");
        else if (idx === i) btn.classList.add("bad");
        var mark = btn.querySelector("span");
        if (idx === q.bonne) mark.textContent = "✓"; else if (idx === i) mark.textContent = "✗";
      });
      var ex = host.querySelector("#q-explain");
      ex.innerHTML = '<div class="q-explain">' + (i === q.bonne ? "Bravo ! " : "") + esc(q.explication || "") + "</div>";
      var next = document.createElement("button");
      next.className = "btn btn-primary"; next.style.marginTop = "16px";
      next.textContent = qi < D.quiz.length - 1 ? "Question suivante" : "Voir le mémo";
      next.addEventListener("click", function () {
        if (qi < D.quiz.length - 1) { qi++; render(); }
        else { goto(cur + 1); }
      });
      ex.appendChild(next);
      footBtn.style.display = "none"; // le quiz pilote sa propre nav
      refreshCta();
    }
    render();
  }

  /* --- badge localStorage --- */
  function setBadge(v) { try { localStorage.setItem("atelier_" + D.slug, v); } catch (e) {} }

  /* --- rendu général + navigation --- */
  var cur = 0;
  var stage = document.createElement("div"); stage.className = "stage";
  steps.forEach(function (st, i) {
    var sec = document.createElement("section");
    sec.className = "screen"; sec.dataset.step = i;
    sec.innerHTML = st.html();
    st._el = sec; stage.appendChild(sec);
  });

  // écran final (hors steps)
  var finEl = document.createElement("section");
  finEl.className = "screen fin";
  finEl.innerHTML = '<div class="badge-big">' + esc(D.fin.badge || "🥇") + "</div>" +
    "<h2>" + esc(D.fin.titre || (D.titre + " validé !")) + "</h2>" +
    "<p>" + esc(D.fin.message || "") + "</p>";
  stage.appendChild(finEl);

  // barre du haut
  var topbar = document.createElement("div"); topbar.className = "topbar";
  topbar.innerHTML = '<div class="brand">🩺 MEDIBOX · ANTILLES-GUYANE</div>' +
    '<div class="progress">' + steps.map(function () { return "<span></span>"; }).join("") + "</div>" +
    '<div class="step-count"></div>';

  // barre du bas
  var footbar = document.createElement("div"); footbar.className = "footbar";
  footbar.innerHTML = '<div class="inner"><button class="btn btn-ghost" id="back" aria-label="Précédent">←</button>' +
    '<button class="btn btn-primary" id="next">Continuer</button></div>';

  root.appendChild(topbar); root.appendChild(stage); root.appendChild(footbar);
  var footBtn = footbar.querySelector("#next");
  var backBtn = footbar.querySelector("#back");

  function refreshCta() {
    var st = steps[cur];
    if (!st) return;
    footBtn.textContent = st.cta ? st.cta() : "Continuer";
    footBtn.disabled = st.canContinue ? !st.canContinue() : false;
  }

  function goto(i) {
    // i peut pointer sur l'écran final
    var allEls = steps.map(function (s) { return s._el; }).concat([finEl]);
    if (i < 0 || i > allEls.length - 1) return;
    allEls.forEach(function (el) { el.classList.remove("active"); });
    allEls[i].classList.add("active");
    window.scrollTo(0, 0);

    // progression
    var dots = topbar.querySelectorAll(".progress span");
    dots.forEach(function (d, k) {
      d.classList.toggle("done", k < i); d.classList.toggle("cur", k === i);
    });

    if (i < steps.length) {
      cur = i;
      var st = steps[cur];
      topbar.querySelector(".step-count").textContent = "Étape " + (i + 1) + " sur " + steps.length;
      footbar.style.display = "";
      footBtn.style.display = "";
      backBtn.style.display = i === 0 ? "none" : "";
      if (!st._entered && st.onEnter) { st.onEnter(st._el); st._entered = true; }
      refreshCta();
    } else {
      // écran final
      setBadge("valide");
      footbar.style.display = "";
      footBtn.style.display = "none";
      backBtn.style.display = "none";
      var inner = footbar.querySelector(".inner");
      if (!inner.querySelector("#hub")) {
        var a = document.createElement("a");
        a.id = "hub"; a.className = "btn btn-primary";
        a.href = D.fin.hubUrl || "../ateliers/";
        a.textContent = D.fin.ctaHub || "Voir tous les ateliers";
        inner.appendChild(a);
      }
    }
  }

  footBtn.addEventListener("click", function () {
    var st = steps[cur];
    if (st && st.key === "ident") {
      // récap léger en console (front only)
      setBadge("en_cours");
    }
    goto(cur + 1);
  });
  backBtn.addEventListener("click", function () { if (cur > 0) goto(cur - 1); });

  // Permet à l'éditeur d'aperçu de sauter directement à un écran.
  window.__atelierGoto = goto;
  window.__atelierSteps = steps.map(function (s) { return s.key; });

  goto(typeof window.ATELIER_START === "number" ? window.ATELIER_START : 0);
  } // fin start()

  // Bootstrap : charge le contenu à jour depuis Supabase (source de vérité),
  // avec repli sur le contenu local (contenu.js) si la base ne répond pas.
  var __slug = (window.ATELIER_DATA || {}).slug;
  var __db = window.ATELIER_DB;
  if (!__slug || !__db || !window.fetch || window.ATELIER_NO_DB) { start(); return; }
  var __done = false;
  function __go() { if (__done) return; __done = true; start(); }
  var __t = setTimeout(__go, 2500);
  fetch(__db.url + "/rest/v1/ateliers_contenu?slug=eq." + encodeURIComponent(__slug) + "&select=data", {
    headers: { apikey: __db.anonKey, Authorization: "Bearer " + __db.anonKey }
  }).then(function (r) { return r.ok ? r.json() : null; })
    .then(function (rows) { if (rows && rows[0] && rows[0].data) { window.ATELIER_DATA = rows[0].data; } })
    .catch(function () {})
    .then(function () { clearTimeout(__t); __go(); });
})();
