/* ---------- Colour scheme: light / dark / system ----------
   The choice is saved in the browser (localStorage) under "fubs-theme".
   "system" = no saved choice, so the CSS follows the device setting. */
(function () {
  const root = document.documentElement;
  const KEY = "fubs-theme";

  function savedChoice() {
    try {
      const t = localStorage.getItem(KEY);
      return t === "light" || t === "dark" ? t : "system";
    } catch (e) {
      return "system";
    }
  }

  function applyChoice(choice) {
    if (choice === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", choice);
    document.querySelectorAll("[data-theme-choice]").forEach((btn) => {
      btn.setAttribute(
        "aria-pressed",
        String(btn.dataset.themeChoice === choice),
      );
    });
    // Tint the phone browser bar to match.
    const dark =
      choice === "dark" ||
      (choice === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#0f1a23" : "#17324d");
  }

  function setChoice(choice) {
    try {
      if (choice === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, choice);
    } catch (e) {}
    applyChoice(choice);
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyChoice(savedChoice());
    document.querySelectorAll("[data-theme-choice]").forEach((btn) => {
      btn.addEventListener("click", () => setChoice(btn.dataset.themeChoice));
    });
  });
  // Keep other open tabs in sync, and follow device changes while on "System".
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) applyChoice(savedChoice());
  });
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (savedChoice() === "system") applyChoice("system");
    });
})();

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
  }

  document.querySelectorAll(".nav-drop-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const menu = btn.nextElementSibling;
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("show", !expanded);
    });
  });

  document.querySelectorAll(".flash-close").forEach((btn) => {
    btn.addEventListener("click", () => btn.closest(".flash")?.remove());
  });

  document.querySelectorAll("form[data-confirm]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!window.confirm(form.dataset.confirm || "Are you sure?"))
        event.preventDefault();
    });
  });

  const imageInput = document.querySelector("[data-image-input]");
  const preview = document.querySelector("[data-image-preview]");
  if (imageInput && preview) {
    imageInput.addEventListener("change", () => {
      const file = imageInput.files && imageInput.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        preview.textContent = "Please select an image file.";
        imageInput.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.innerHTML = "";
        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = "Selected product preview";
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }

  document.querySelectorAll("input, textarea, select").forEach((el) => {
    el.addEventListener("invalid", () => el.classList.add("invalid"));
    el.addEventListener("input", () => el.classList.remove("invalid"));
  });
});
