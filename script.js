const gameData = {
  Valorant: 1.0,
  CS2: 3.181818,
  "Rainbow Six Siege": 12.216667,
  Rust: 0.622222,
};

let isCopying = false;

function switchTab(evt, id) {
  const sections = document.querySelectorAll(".section");
  const buttons = document.querySelectorAll(".button-container .button");
  sections.forEach((s) => (s.style.display = "none"));
  buttons.forEach((b) => b.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.style.display = "flex";
  evt.currentTarget.classList.add("active");
}

function updateConversion() {
  const getVal = (id) => document.getElementById(id)?.value || "";
  const fromGame = getVal("from-search");
  const toGame = getVal("to-search");
  const baseSens = getVal("base-sens");
  const fDpi = parseFloat(getVal("from-dpi"));
  const tDpi = parseFloat(getVal("to-dpi"));
  const display = document.getElementById("new-sens-value");

  if (!display) return;

  const sens = parseFloat(baseSens.replace(",", "."));
  const isValid = fromGame && toGame && baseSens !== "" && !isNaN(fDpi) && !isNaN(tDpi);

  if (!isValid || fDpi === 0 || tDpi === 0 || isNaN(sens)) {
    display.innerText = "0.000";
    return;
  }

  const fromFactor = gameData[fromGame];
  const toFactor = gameData[toGame];

  if (fromFactor && toFactor) {
    const convertedSens = sens * (toFactor / fromFactor) * (fDpi / tDpi);
    display.innerText = convertedSens.toFixed(3);
  }
}

function handleInputValidation(input) {
  const isDpi = input.id.includes("dpi");
  const regex = isDpi ? /^[0-9]*$/ : /^[0-9.,]*$/;
  const cleanRegex = isDpi ? /[^0-9]/g : /[^0-9.,]/g;

  input.addEventListener("beforeinput", (e) => {
    if (e.data && !regex.test(e.data)) e.preventDefault();
  });

  input.addEventListener("input", () => {
    const start = input.selectionStart;
    if (cleanRegex.test(input.value)) {
      input.value = input.value.replace(cleanRegex, "");
      input.setSelectionRange(start - 1, start - 1);
    }
    if (input.value.length > 10) input.value = input.value.substring(0, 10);
    updateConversion();
  });

  input.addEventListener("focus", function () {
    setTimeout(() => this.select(), 0);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const numericInputs = ["base-sens", "from-dpi", "to-dpi"];

  ["from", "to"].forEach((idPrefix) => {
    const list = document.getElementById(`${idPrefix}-list`);
    const input = document.getElementById(`${idPrefix}-search`);
    const clearBtn = document.getElementById(`${idPrefix}-clear`);
    if (!list || !input) return;

    let activeIndex = -1;
    const getVisible = () => Array.from(list.querySelectorAll(".game-option")).filter((o) => o.style.display !== "none");

    const syncUI = (visible, scroll = true) => {
      visible.forEach((opt, i) => opt.classList.toggle("hover", i === activeIndex));
      if (scroll && activeIndex >= 0 && visible[activeIndex]) {
        visible[activeIndex].scrollIntoView({ block: "nearest" });
      }
      if (clearBtn) clearBtn.style.display = input.value ? "flex" : "none";
    };

    input.addEventListener("focus", () => {
      document.querySelectorAll(".dropdown-list").forEach((l) => l.classList.add("hidden"));
      input.value = "";
      list.querySelectorAll(".game-option").forEach((o) => {
        o.style.display = "flex";
        o.classList.remove("hover");
      });
      list.classList.remove("hidden");
      activeIndex = 0;
      syncUI(getVisible());
      updateConversion();
    });

    input.addEventListener("keydown", (e) => {
      const visible = getVisible();
      if (!visible.length) return;

      if (e.key === "ArrowDown") {
        activeIndex = (activeIndex + 1) % visible.length;
        syncUI(visible);
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        activeIndex = (activeIndex - 1 + visible.length) % visible.length;
        syncUI(visible);
        e.preventDefault();
      } else if (e.key === "Enter" && activeIndex >= 0) {
        visible[activeIndex].dispatchEvent(new Event("mousedown"));
        e.preventDefault();
      } else if (e.key === "Escape") {
        list.classList.add("hidden");
        input.blur();
      }
    });

    input.addEventListener("input", () => {
      const filter = input.value.toLowerCase();
      list.querySelectorAll(".game-option").forEach((o) => (o.style.display = o.textContent.toLowerCase().includes(filter) ? "flex" : "none"));
      list.classList.remove("hidden");
      activeIndex = 0;
      syncUI(getVisible());
      updateConversion();
    });

    if (clearBtn) {
      clearBtn.addEventListener("mousedown", (e) => {
        e.preventDefault();
        input.value = "";
        clearBtn.style.display = "none";
        const options = list.querySelectorAll(".game-option");
        options.forEach((o) => (o.style.display = "flex"));
        activeIndex = 0;
        syncUI(getVisible());
        updateConversion();
        input.focus();
      });
    }

    list.querySelectorAll(".game-option").forEach((opt) => {
      opt.addEventListener("mousemove", () => {
        const visible = getVisible();
        const newIndex = visible.indexOf(opt);
        if (activeIndex !== newIndex) {
          activeIndex = newIndex;
          syncUI(visible, false);
        }
      });

      opt.addEventListener("mousedown", (e) => {
        e.preventDefault();
        input.value = opt.querySelector(".game-name").textContent;
        list.classList.add("hidden");
        if (clearBtn) clearBtn.style.display = "flex";
        updateConversion();
        input.blur();
      });
    });
  });

  numericInputs.forEach((id) => {
    const el = document.getElementById(id);
    if (el) handleInputValidation(el);
  });

  const navMap = { "base-sens": "from-dpi", "from-dpi": "to-dpi" };
  Object.keys(navMap).forEach((id) => {
    document.getElementById(id)?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById(navMap[id])?.focus();
      }
    });
  });

  document.getElementById("to-dpi")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.target.blur();
  });

  document.getElementById("swap-btn")?.addEventListener("click", () => {
    const fG = document.getElementById("from-search"),
      tG = document.getElementById("to-search");
    const fD = document.getElementById("from-dpi"),
      tD = document.getElementById("to-dpi");
    const bS = document.getElementById("base-sens"),
      res = document.getElementById("new-sens-value");

    if (fG && tG && fD && tD && bS && res) {
      if (res.innerText !== "0.000") bS.value = res.innerText;
      [fG.value, tG.value] = [tG.value, fG.value];
      [fD.value, tD.value] = [tD.value, fD.value];
      updateConversion();

      const fClear = document.getElementById("from-clear");
      const tClear = document.getElementById("to-clear");
      if (fClear) fClear.style.display = fG.value ? "flex" : "none";
      if (tClear) tClear.style.display = tG.value ? "flex" : "none";
    }
  });

  document.getElementById("copy-btn")?.addEventListener("click", function () {
    if (isCopying) return;

    const val = document.getElementById("new-sens-value")?.innerText;
    const btnText = this.querySelector("span");
    const originalText = btnText ? btnText.innerText : "COPY";

    if (!val || val === "0.000") {
      this.classList.remove("vibrate");
      void this.offsetWidth;
      this.classList.add("vibrate");

      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([50, 30, 50]);
      }

      setTimeout(() => {
        this.classList.remove("vibrate");
      }, 300);
      return;
    }

    isCopying = true;

    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }

    navigator.clipboard.writeText(val).then(() => {
      this.classList.add("copied");
      if (btnText) btnText.innerText = "COPIED!";

      setTimeout(() => {
        this.classList.remove("copied");
        if (btnText) btnText.innerText = originalText;
        isCopying = false;
      }, 1500);
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-dropdown")) {
      document.querySelectorAll(".dropdown-list").forEach((l) => l.classList.add("hidden"));
    }
  });

  updateConversion();
});
