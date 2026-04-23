const projects = [
  {
    title: { en: "Kite and surf school", cs: "Škola kiteboardingu a surfingu" },
    desc: { en: "Kiteboard and surf school and rental website.", cs: "Webové stránky kiteboardové a surfové školy a půjčovny." },
    tags: ["HTML", "CSS", "JS"],
    image: "assets/img/kiteprojectview.png",
    url: "projects/kiteweb/index.html",
  },
  {
    title: { en: "Project Two", cs: "Projekt dva" },
    desc: { en: "Short description…", cs: "Krátký popis…" },
    tags: ["HTML", "CSS", "JS"],
    image: "assets/img/project-2.jpg",
    url: "#",
  },
];

const I18N = {
  en: {
    "hero.kicker": "portfolio / projects",
    "hero.subtitle":
      "A small, technical showcase of things I build — fast, clean, and pragmatic.",
    "about.title": "About",
    "about.lede":
      "This single-page site is built with HTML5, CSS3, and vanilla JavaScript. The layout is intentionally minimal and dark, with a subtle “terminal” vibe.",
    "projects.title": "Projects",
    "projects.hint.before": "Add more projects by appending a new item in",
    "footer.contact": "Contact: Coming soon",
    "card.pill.link": "link",
    "card.tags.aria": "Tech tags",
    "card.open": "Open project",
    "card.aria.openPrefix": "Open",
  },
  cs: {
    "hero.kicker": "portfolio / projekty",
    "hero.subtitle":
      "Malá technická ukázka toho, co tvořím — rychle, čistě a pragmaticky.",
    "about.title": "O mně",
    "about.lede":
      "Tato jednostránková stránka je postavená na HTML5, CSS3 a čistém JavaScriptu. Rozvržení je záměrně minimalistické a tmavé, s jemnou „terminálovou“ atmosférou.",
    "projects.title": "Projekty",
    "projects.hint.before": "Další projekty přidáš připsáním položky do",
    "footer.contact": "Kontakt: Dělá se na tom",
    "card.pill.link": "odkaz",
    "card.tags.aria": "Technologie",
    "card.open": "Otevřít projekt",
    "card.aria.openPrefix": "Otevřít",
  },
};

function getInitialLang() {
  const saved = localStorage.getItem("lang");
  if (saved === "en" || saved === "cs") return saved;
  const nav = (navigator.language || "").toLowerCase();
  return nav.startsWith("cs") ? "cs" : "en";
}

let currentLang = "en";

function t(key) {
  return I18N[currentLang]?.[key] ?? I18N.en[key] ?? key;
}

function el(tag, { className, text, attrs } = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  }
  return node;
}

function setLang(next) {
  currentLang = next === "cs" ? "cs" : "en";
  document.documentElement.lang = currentLang;
  localStorage.setItem("lang", currentLang);

  const btn = document.getElementById("langToggle");
  if (btn) {
    btn.textContent = currentLang.toUpperCase();
    btn.setAttribute("aria-label", currentLang === "cs" ? "Switch to English" : "Přepnout do češtiny");
  }

  for (const node of document.querySelectorAll("[data-i18n]")) {
    const key = node.getAttribute("data-i18n");
    if (!key) continue;
    node.textContent = t(key);
  }

  renderProjects();
}

function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  grid.textContent = "";

  for (const p of projects) {
    const card = el("article", { className: "card", attrs: { role: "listitem" } });

    const inner = el("div", { className: "card__inner" });

    const media = el("div", { className: "card__media", attrs: { "aria-hidden": "true" } });
    const img = el("img", {
      className: "card__img",
      attrs: {
        src: p.image || "",
        alt: "",
        loading: "lazy",
        decoding: "async",
      },
    });
    img.addEventListener("error", () => {
      media.setAttribute("data-empty", "true");
      img.remove();
    });
    if (p.image) media.append(img);

    const titleText = typeof p.title === "string" ? p.title : p.title?.[currentLang] ?? p.title?.en ?? "";
    const descText = typeof p.desc === "string" ? p.desc : p.desc?.[currentLang] ?? p.desc?.en ?? "";

    const titleRow = el("div", { className: "card__titleRow" });
    titleRow.append(el("h3", { className: "card__title", text: titleText }));
    titleRow.append(el("span", { className: "pill", text: t("card.pill.link") }));

    const desc = el("p", { className: "card__desc", text: descText });

    const tags = el("div", { className: "tags", attrs: { "aria-label": t("card.tags.aria") } });
    for (const t of p.tags ?? []) tags.append(el("span", { className: "pill", text: t }));

    const link = el("a", {
      className: "card__link",
      attrs: {
        href: p.url || "#",
        "aria-label": `${t("card.aria.openPrefix")} ${titleText}`,
      },
    });
    link.append(el("span", { text: t("card.open") }));
    link.append(el("span", { className: "muted", text: "→" }));

    inner.append(media, titleRow, desc, tags, link);
    card.append(inner);
    grid.append(card);
  }
}

function setYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  currentLang = getInitialLang();
  const btn = document.getElementById("langToggle");
  if (btn) {
    btn.addEventListener("click", () => {
      setLang(currentLang === "en" ? "cs" : "en");
    });
  }

  setLang(currentLang);
  setYear();
});

