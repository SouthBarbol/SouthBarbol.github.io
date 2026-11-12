/**
 * Traductor EN <-> ES del portfolio.
 *
 * El HTML se queda en inglés (idioma original). Este script:
 *   1. recorre la página y guarda cada texto original,
 *   2. al elegir "ES" busca cada texto en el diccionario de translations.js
 *      (clave = texto en inglés, con los espacios normalizados) y lo sustituye,
 *   3. al elegir "EN" restaura los originales.
 * Si un texto no está en el diccionario se queda en inglés y se avisa por consola
 * (F12 > Consola) con "[i18n] sin traducir", para poder añadirlo a translations.js.
 *
 * Hay que cargarlo DESPUÉS de main.js (para que Swiper ya haya creado sus clones).
 */
(function () {
  "use strict";

  var STORAGE_KEY = "portfolioLang";
  var DICT = window.I18N_ES || {};
  var ATTRS = ["alt", "title", "placeholder", "aria-label", "data-typed-items"];
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, SVG: 1, IFRAME: 1, TEXTAREA: 1, VIDEO: 1, AUDIO: 1 };
  var INLINE = { B: 1, I: 1, U: 1, STRONG: 1, EM: 1, BR: 1, SMALL: 1, MARK: 1, SUB: 1, SUP: 1 };

  // Etiquetas de accesibilidad que genera Swiper (puntos, flechas). Swiper las regenera
  // al recrear el slider, así que no van en el diccionario: se traducen por patrón.
  var SWIPER_EN = [
    [/^Go to slide (\d+)$/, "Ir a la diapositiva $1"],
    [/^Previous slide$/, "Diapositiva anterior"],
    [/^Next slide$/, "Diapositiva siguiente"]
  ];
  var SWIPER_ES = [
    [/^Ir a la diapositiva (\d+)$/, "Go to slide $1"],
    [/^Diapositiva anterior$/, "Previous slide"],
    [/^Diapositiva siguiente$/, "Next slide"]
  ];
  function isSwiperLabel(v) {
    return SWIPER_EN.some(function (p) { return p[0].test(v); });
  }
  function relabelSwiper(lang) {
    var rules = lang === "es" ? SWIPER_EN : SWIPER_ES;
    document.querySelectorAll(".swiper [aria-label]").forEach(function (el) {
      var v = el.getAttribute("aria-label");
      for (var i = 0; i < rules.length; i++) {
        if (rules[i][0].test(v)) { el.setAttribute("aria-label", v.replace(rules[i][0], rules[i][1])); break; }
      }
    });
  }

  var entries = [];          // { node, kind: 'text'|'html'|'attr'|'title', name, en, pre, post }
  var currentLang = "en";
  var missing = {};

  function norm(s) { return s.replace(/\s+/g, " ").trim(); }
  function hasLetters(s) { return /\p{L}/u.test(s); }

  // Elementos que se ignoran por completo
  function skipAll(el) {
    return /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(el.tagName) ||
      el.id === "preloader" ||
      el.classList.contains("swiper-slide-duplicate") ||   // los clones se rehacen al cambiar de idioma
      el.hasAttribute("data-no-i18n");
  }

  // Elementos cuyo texto interior no se toca (pero sí sus atributos: aria-label, title...)
  function skipContent(el) {
    return !!SKIP[el.tagName.toUpperCase()] ||
      el.classList.contains("typed") ||           // lo escribe Typed.js
      el.classList.contains("typed-cursor");
  }

  function onlyInline(el) {
    var kids = el.children;
    for (var i = 0; i < kids.length; i++) {
      if (!INLINE[kids[i].tagName.toUpperCase()] || !onlyInline(kids[i])) return false;
    }
    return true;
  }

  // <li><strong>Etiqueta</strong>: valor</li>  ->  se traducen etiqueta y valor por separado
  function isLabelValue(el) {
    var f = el.firstChild;
    if (!f || f.nodeType !== 1 || !/^(STRONG|B)$/i.test(f.tagName)) return false;
    var n = f.nextSibling;
    return !!(n && n.nodeType === 3 && /^\s*:/.test(n.nodeValue));
  }

  // entrada con el contenido original literal y sus espacios de los extremos
  function mk(node, kind, raw) {
    return { node: node, kind: kind, raw: raw, en: norm(raw), pre: /^\s*/.exec(raw)[0], post: /\s*$/.exec(raw)[0] };
  }

  function collect(el) {
    if (skipAll(el)) return;
    if (skipContent(el)) {
      // nada que recorrer dentro
    } else if (el.children.length === 0) {
      if (hasLetters(el.textContent)) {
        entries.push(mk(el, "plain", el.textContent));
      }
    } else if (onlyInline(el) && !isLabelValue(el)) {
      if (hasLetters(el.textContent)) {
        entries.push(mk(el, "html", el.innerHTML));
      }
    } else {
      for (var c = el.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 1) {
          collect(c);
        } else if (c.nodeType === 3) {
          var m = /^(\s*:?\s*)([\s\S]*?)(\s*)$/.exec(c.nodeValue);
          if (hasLetters(m[2])) {
            entries.push({ node: c, kind: "text", raw: c.nodeValue, en: norm(m[2]), pre: m[1], post: m[3] });
          }
        }
      }
    }
    // atributos de este elemento
    if (el.hasAttributes()) {
      ATTRS.forEach(function (a) {
        var v = el.getAttribute(a);
        if (v && hasLetters(v) && !isSwiperLabel(v)) entries.push({ node: el, kind: "attr", name: a, raw: v, en: norm(v), pre: "", post: "" });
      });
    }
  }

  function translate(en, lang) {
    if (lang !== "es") return en;
    var es = DICT[en];
    if (es === undefined) { missing[en] = true; return en; }
    return es;
  }

  function apply(lang) {
    currentLang = lang;
    missing = {};
    entries.forEach(function (e) {
      var v = lang === "es" ? e.pre + translate(e.en, "es") + e.post : e.raw;
      if (e.kind === "plain") e.node.textContent = v;
      else if (e.kind === "html") e.node.innerHTML = v;
      else if (e.kind === "text") e.node.nodeValue = v;
      else if (e.kind === "attr") e.node.setAttribute(e.name, v);
      else if (e.kind === "title") document.title = v;
    });

    document.documentElement.setAttribute("lang", lang);

    // texto animado del hero
    if (typeof window.restartTyped === "function") window.restartTyped();

    // los sliders en bucle guardan clones: se rehacen con el texto ya traducido
    document.querySelectorAll(".swiper").forEach(function (el) {
      var s = el.swiper;
      if (s && s.params && s.params.loop) {
        var idx = s.realIndex;
        s.loopDestroy(); s.loopCreate(); s.update(); s.slideToLoop(idx, 0, false);
      }
    });

    relabelSwiper(lang);

    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });

    var keys = Object.keys(missing);
    if (lang === "es" && keys.length) console.warn("[i18n] sin traducir (" + keys.length + "):", keys);
  }

  function setLang(lang) {
    if (lang !== "en" && lang !== "es") return;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* modo privado: no se recuerda */ }
    apply(lang);
  }

  function buildSwitch() {
    var ul = document.querySelector("#navbar ul");
    if (!ul) return;
    var li = document.createElement("li");
    li.className = "lang-switch";
    li.setAttribute("data-no-i18n", "");
    li.innerHTML =
      '<button type="button" data-lang="en" lang="en" aria-label="English" aria-pressed="true">EN</button>' +
      '<span class="lang-sep" aria-hidden="true">/</span>' +
      '<button type="button" data-lang="es" lang="es" aria-label="Español" aria-pressed="false">ES</button>';
    li.addEventListener("click", function (ev) {
      var b = ev.target.closest("button[data-lang]");
      if (b) setLang(b.getAttribute("data-lang"));
    });
    ul.appendChild(li);
  }

  function init() {
    if (document.title && hasLetters(document.title)) {
      entries.push({ node: document, kind: "title", raw: document.title, en: norm(document.title), pre: "", post: "" });
    }
    collect(document.body);
    buildSwitch();
    var saved = "en";
    try { saved = localStorage.getItem(STORAGE_KEY) || "en"; } catch (e) { /* ignorar */ }
    if (saved === "es") apply("es");
  }

  // API mínima por si se quiere usar desde fuera / depurar
  window.i18n = {
    setLang: setLang,
    getLang: function () { return currentLang; },
    keys: function () { return entries.map(function (e) { return e.en; }); },
    dump: function () { return entries.map(function (e) { return { en: e.en, kind: e.kind + (e.name ? ":" + e.name : "") }; }); }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
