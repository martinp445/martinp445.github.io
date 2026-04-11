(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var body = document.body;
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.getElementById("site-nav");
  var navLinks = siteNav ? siteNav.querySelectorAll('a[href^="#"]') : [];

  function setNavOpen(open) {
    body.classList.toggle("nav-open", open);
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      setNavOpen(!body.classList.contains("nav-open"));
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        setNavOpen(false);
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    var id = anchor.getAttribute("href");
    if (!id || id === "#") {
      return;
    }
    anchor.addEventListener("click", function (e) {
      var target = document.querySelector(id);
      if (!target) {
        return;
      }
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (history.replaceState) {
        history.replaceState(null, "", id);
      }
    });
  });

  var sections = document.querySelectorAll("main section[id]");
  var navAnchors = document.querySelectorAll('.site-nav a[href^="#"]');

  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          var id = entry.target.getAttribute("id");
          if (!id) {
            return;
          }
          navAnchors.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach(function (sec) {
      observer.observe(sec);
    });
  }

  var lessonSection = document.getElementById("lessons");
  var sportSelect = document.getElementById("sport");
  var levelSelect = document.getElementById("level");
  var messageField = document.getElementById("message");
  var contactSection = document.getElementById("contact");
  var formSuccessBanner = document.getElementById("form-success");

  var sportLabels = { kite: "Kiteboarding", surf: "Surfing" };
  var levelLabels = { beginner: "Beginner", intermediate: "Intermediate", pro: "Pro" };

  function clearInlineFieldErrors() {
    [
      "name-error",
      "email-error",
      "sport-error",
      "level-error",
      "lesson-start-error",
      "lesson-end-error",
      "message-error"
    ].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.textContent = "";
        el.hidden = true;
      }
    });
  }

  if (lessonSection && sportSelect && levelSelect && contactSection) {
    lessonSection.addEventListener("click", function (e) {
      var card = e.target.closest(".level-card[data-sport][data-level]");
      if (!card) {
        return;
      }
      var sport = card.getAttribute("data-sport");
      var level = card.getAttribute("data-level");
      if (!sport || !level) {
        return;
      }

      sportSelect.value = sport;
      levelSelect.value = level;

      if (messageField && !messageField.value.trim()) {
        messageField.value =
          "I'd like to book a " +
          (sportLabels[sport] || sport) +
          " lesson (" +
          (levelLabels[level] || level) +
          ").";
      }

      setNavOpen(false);
      clearInlineFieldErrors();
      if (formSuccessBanner) {
        formSuccessBanner.hidden = true;
      }

      var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      contactSection.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });
      if (history.replaceState) {
        history.replaceState(null, "", "#contact");
      }

      var nameInput = document.getElementById("name");
      if (nameInput) {
        window.setTimeout(
          function () {
            nameInput.focus({ preventScroll: true });
          },
          reducedMotion ? 0 : 450
        );
      }
    });
  }

  var form = document.getElementById("contact-form");
  if (!form) {
    return;
  }

  var fields = [
    { id: "name", errorId: "name-error", message: "Please enter your name." },
    { id: "email", errorId: "email-error", message: "Please enter a valid email.", validate: isValidEmail },
    { id: "sport", errorId: "sport-error", message: "Please choose a sport." },
    { id: "level", errorId: "level-error", message: "Please choose your level." },
    { id: "lesson-start", errorId: "lesson-start-error", message: "Please choose a lesson start date." },
    { id: "lesson-end", errorId: "lesson-end-error", message: "Please choose a lesson end date." },
    { id: "message", errorId: "message-error", message: "Please add a short message." }
  ];

  var successEl = document.getElementById("form-success");

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function showError(errorEl, text) {
    if (!errorEl) {
      return;
    }
    errorEl.textContent = text;
    errorEl.hidden = false;
  }

  function clearErrors() {
    fields.forEach(function (f) {
      var el = document.getElementById(f.errorId);
      if (el) {
        el.textContent = "";
        el.hidden = true;
      }
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();
    if (successEl) {
      successEl.hidden = true;
    }

    var ok = true;
    fields.forEach(function (f) {
      var input = document.getElementById(f.id);
      var err = document.getElementById(f.errorId);
      if (!input) {
        return;
      }
      var value;
      if (input.tagName === "SELECT") {
        value = input.value;
      } else if (input.type === "email") {
        value = input.value.trim();
      } else if (input.type === "date") {
        value = input.value;
      } else {
        value = input.value.trim();
      }
      if (!value) {
        showError(err, f.message);
        ok = false;
        return;
      }
      if (f.validate && !f.validate(value)) {
        showError(err, f.message);
        ok = false;
      }
    });

    var lessonStartInput = document.getElementById("lesson-start");
    var lessonEndInput = document.getElementById("lesson-end");
    if (ok && lessonStartInput && lessonEndInput) {
      var startVal = lessonStartInput.value;
      var endVal = lessonEndInput.value;
      if (startVal && endVal && endVal < startVal) {
        showError(
          document.getElementById("lesson-end-error"),
          "Lesson end must be on or after the start date."
        );
        ok = false;
      }
    }

    if (ok && successEl) {
      successEl.hidden = false;
      form.reset();
      syncLessonDateConstraints();
    }
  });

  function todayISODate() {
    var d = new Date();
    var mo = d.getMonth() + 1;
    var day = d.getDate();
    var m = mo < 10 ? "0" + mo : String(mo);
    var dy = day < 10 ? "0" + day : String(day);
    return d.getFullYear() + "-" + m + "-" + dy;
  }

  function syncLessonDateConstraints() {
    var start = document.getElementById("lesson-start");
    var end = document.getElementById("lesson-end");
    if (!start || !end) {
      return;
    }
    var today = todayISODate();
    start.setAttribute("min", today);
    var minEnd = start.value && start.value >= today ? start.value : today;
    end.setAttribute("min", minEnd);
    if (end.value && start.value && end.value < start.value) {
      end.value = start.value;
    }
  }

  var lessonStartEl = document.getElementById("lesson-start");
  if (lessonStartEl) {
    lessonStartEl.addEventListener("change", syncLessonDateConstraints);
    lessonStartEl.addEventListener("input", syncLessonDateConstraints);
  }
  syncLessonDateConstraints();
})();
