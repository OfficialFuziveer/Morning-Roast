const gameData = {
  Valorant: 1.0,
  CS2: 3.181818,
  "Rainbow Six Siege": 12.216667,
  Rust: 0.622222,
};

const proDatabase = {
  Valorant: {
    low: ["Alfajer", "Demon1", "Less", "pANcada"],
    average: ["Aspas", "Derke", "TenZ", "Zekken"],
    high: ["f0rsakeN", "something", "Asuna", "Hiko"],
  },
  CS2: {
    low: ["Ropz", "NiKo", "ZywOo", "Jame"],
    average: ["m0NESY", "dev1ce", "s1mple", "Twistzz"],
    high: ["ELiGE", "Woxic", "Forest", "Xantares"],
  },
  General: {
    low: ["Pro Low"],
    average: ["Pro Average"],
    high: ["Pro High"],
  },
};

let isCopying = false;

function getAdvice(edpi) {
  if (edpi < 200) return "Extremely low. Excellent for pixel-perfect long-range shots, but requires massive arm movement.";
  if (edpi >= 200 && edpi < 400) return "Precision range. The 'sweet spot' for tactical shooters like Valorant and CS2.";
  if (edpi >= 400 && edpi <= 800) return "Balanced. A great middle-ground for entry fragging and quick 180s.";
  if (edpi > 800 && edpi <= 1200) return "High speed. Fast reactive flicking, but requires very high fine-motor mouse control.";
  return "Very high. Can lead to jittery aim. Most pros stay below this range for better consistency.";
}

function switchTab(evt, id) {
  const sections = document.querySelectorAll(".section");
  const buttons = document.querySelectorAll(".button-container .button");
  sections.forEach((s) => (s.style.display = "none"));
  buttons.forEach((b) => b.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.style.display = "flex";
  evt.currentTarget.classList.add("active");
}

function toggleResetButton() {
  const resetBtn = document.getElementById("reset-btn");
  if (!resetBtn) return;
  const fG = document.getElementById("from-search").value;
  const tG = document.getElementById("to-search").value;
  const bS = document.getElementById("base-sens").value;
  const fD = document.getElementById("from-dpi").value;
  const tD = document.getElementById("to-dpi").value;
  const isDefault = fG === "" && tG === "" && bS === "" && fD === "" && tD === "";
  resetBtn.classList.toggle("is-default", isDefault);
}

function updateConversion() {
  const getVal = (id) => document.getElementById(id)?.value || "";
  const fromGame = getVal("from-search");
  const toGame = getVal("to-search");
  const baseSens = getVal("base-sens");
  const fDpi = parseFloat(getVal("from-dpi"));
  const tDpi = parseFloat(getVal("to-dpi"));
  const display = document.getElementById("new-sens-value");

  ["from", "to"].forEach((id) => {
    const btn = document.getElementById(`${id}-clear`);
    const input = document.getElementById(`${id}-search`);
    if (btn && input) btn.style.display = input.value ? "flex" : "none";
  });

  toggleResetButton();
  if (!display) return;
  const sens = parseFloat(baseSens.replace(",", "."));
  const isValid = fromGame && toGame && baseSens !== "" && !isNaN(fDpi) && !isNaN(tDpi);
  if (!isValid || fDpi === 0 || tDpi === 0 || isNaN(sens)) {
    display.innerText = "0.00";
    return;
  }

  const fromFactor = gameData[fromGame];
  const toFactor = gameData[toGame];

  if (fromFactor && toFactor) {
    const convertedSens = sens * (toFactor / fromFactor) * (fDpi / tDpi);
    display.innerText = convertedSens.toFixed(3);
  }
}

function updateEDPI() {
  const dpiVal = document.getElementById("edpi-dpi").value;
  const sensVal = document.getElementById("edpi-sens").value;
  const gameVal = document.getElementById("edpi-game-search").value;
  const display = document.getElementById("edpi-value");
  const pointer = document.getElementById("spectrum-pointer");
  const rankLabel = document.getElementById("edpi-rank");
  const proDisplay = document.getElementById("pro-comparison");
  const proName = document.getElementById("pro-name");
  const suggestBox = document.getElementById("sens-suggestion");
  const suggestText = document.getElementById("suggestion-text");
  const adviceDot = document.getElementById("advice-dot");

  const defaultBlue = "hsl(198, 93%, 60%)";

  const clearBtn = document.getElementById("edpi-game-clear");
  if (clearBtn) clearBtn.style.display = gameVal ? "flex" : "none";

  if (gameVal === "" || dpiVal === "" || sensVal === "" || parseFloat(dpiVal) === 0) {
    if (display) display.innerText = "0";
    if (rankLabel) rankLabel.style.opacity = "0";
    if (proDisplay) proDisplay.style.opacity = "0";
    if (suggestBox) suggestBox.style.display = "none";
    if (pointer) {
      pointer.style.left = "0%";
      pointer.style.backgroundColor = defaultBlue;
      pointer.style.boxShadow = `0 0 1rem ${defaultBlue}`;
    }
    return;
  }

  const edpi = Math.round(parseFloat(dpiVal) * parseFloat(sensVal.replace(",", ".")));
  if (display) display.innerText = edpi;

  let percent, color, label, tier;

  // Game-specific range logic
  if (gameVal === "Valorant") {
    if (edpi < 200) {
      label = "PRO LOW";
      color = "hsl(198, 93%, 60%)";
      tier = "low";
      percent = Math.min((edpi / 200) * 33, 33);
    } else if (edpi <= 400) {
      label = "PRO AVERAGE";
      color = "hsl(var(--vibrant-red))";
      tier = "average";
      percent = 33 + ((edpi - 200) / 200) * 33;
    } else {
      label = "PRO HIGH";
      color = "hsl(43, 96%, 56%)";
      tier = "high";
      percent = Math.min(66 + ((edpi - 400) / 600) * 34, 100);
    }
  } else if (gameVal === "CS2") {
    if (edpi < 600) {
      label = "PRO LOW";
      color = "hsl(198, 93%, 60%)";
      tier = "low";
      percent = Math.min((edpi / 600) * 33, 33);
    } else if (edpi <= 1000) {
      label = "PRO AVERAGE";
      color = "hsl(var(--vibrant-red))";
      tier = "average";
      percent = 33 + ((edpi - 600) / 400) * 33;
    } else {
      label = "PRO HIGH";
      color = "hsl(43, 96%, 56%)";
      tier = "high";
      percent = Math.min(66 + ((edpi - 1000) / 1000) * 34, 100);
    }
  }

  if (pointer) {
    pointer.style.left = `${percent}%`;
    pointer.style.backgroundColor = color;
    pointer.style.boxShadow = `0 0 1rem ${color}`;
  }

  if (rankLabel) {
    rankLabel.innerText = label;
    rankLabel.style.color = color;
    rankLabel.style.opacity = "1";
  }

  if (proDisplay && proName) {
    const gamePool = proDatabase[gameVal] || proDatabase.General;
    const pros = gamePool[tier];
    proName.innerText = pros[Math.floor(Math.random() * pros.length)];
    proName.style.color = color;
    proDisplay.style.opacity = "1";
  }

  if (suggestBox && suggestText) {
    suggestText.innerText = getAdvice(edpi);
    suggestBox.style.display = "block";
    if (adviceDot) adviceDot.style.backgroundColor = color;
  }
}

function handleInputValidation(input, callback) {
  const isDpiField = input.id.includes("-dpi");
  const cleanRegex = isDpiField ? /[^0-9]/g : /[^0-9.,]/g;
  input.addEventListener("input", () => {
    const start = input.selectionStart;
    if (cleanRegex.test(input.value)) {
      input.value = input.value.replace(cleanRegex, "");
      input.setSelectionRange(start - 1, start - 1);
    }
    if (input.value.length > 10) input.value = input.value.substring(0, 10);
    callback();
  });
  input.addEventListener("focus", function () {
    setTimeout(() => this.select(), 0);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  ["base-sens", "from-dpi", "to-dpi"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) handleInputValidation(el, updateConversion);
  });

  const edpiDpi = document.getElementById("edpi-dpi");
  const edpiSens = document.getElementById("edpi-sens");

  if (edpiDpi) handleInputValidation(edpiDpi, updateEDPI);
  if (edpiSens) handleInputValidation(edpiSens, updateEDPI);

  document.addEventListener("click", (e) => {
    ["from", "to", "edpi-game"].forEach((idPrefix) => {
      const list = document.getElementById(`${idPrefix}-list`);
      const input = document.getElementById(`${idPrefix}-search`);
      if (list && input && !input.contains(e.target) && !list.contains(e.target)) {
        list.classList.add("hidden");
      }
    });
  });

  ["from", "to", "edpi-game"].forEach((idPrefix) => {
    const list = document.getElementById(`${idPrefix}-list`);
    const input = document.getElementById(`${idPrefix}-search`);
    const clearBtn = document.getElementById(`${idPrefix}-clear`);
    if (!list || !input) return;

    let activeIndex = -1;
    const getVisible = () => Array.from(list.querySelectorAll(".game-option")).filter((o) => o.style.display !== "none");
    const syncUI = (visible) => {
      visible.forEach((opt, i) => opt.classList.toggle("hover", i === activeIndex));
      if (activeIndex >= 0 && visible[activeIndex]) {
        visible[activeIndex].scrollIntoView({ block: "nearest" });
      }
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
      if (idPrefix === "edpi-game") updateEDPI();
      else updateConversion();
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
      if (idPrefix === "edpi-game") updateEDPI();
      else updateConversion();
    });

    if (clearBtn) {
      clearBtn.addEventListener("mousedown", (e) => {
        e.preventDefault();
        input.value = "";
        list.classList.add("hidden");
        if (idPrefix === "edpi-game") updateEDPI();
        else updateConversion();
      });
    }

    list.querySelectorAll(".game-option").forEach((opt) => {
      opt.addEventListener("mousedown", (e) => {
        e.preventDefault();
        input.value = opt.querySelector(".game-name").textContent;
        list.classList.add("hidden");
        if (idPrefix === "edpi-game") updateEDPI();
        else updateConversion();
        input.blur();
      });
    });
  });

  document.getElementById("swap-btn")?.addEventListener("click", () => {
    const el = { fG: document.getElementById("from-search"), tG: document.getElementById("to-search"), fD: document.getElementById("from-dpi"), tD: document.getElementById("to-dpi"), bS: document.getElementById("base-sens"), res: document.getElementById("new-sens-value") };
    if (Object.values(el).every((x) => x)) {
      if (el.res.innerText !== "0.00") el.bS.value = el.res.innerText;
      [el.fG.value, el.tG.value] = [el.tG.value, el.fG.value];
      [el.fD.value, el.tD.value] = [el.tD.value, el.fD.value];
      updateConversion();
    }
  });

  document.getElementById("reset-btn")?.addEventListener("click", () => {
    ["from-search", "to-search", "base-sens", "from-dpi", "to-dpi"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    updateConversion();
  });

  document.getElementById("edpi-reset")?.addEventListener("click", () => {
    if (edpiDpi) edpiDpi.value = "";
    if (edpiSens) edpiSens.value = "";
    const eG = document.getElementById("edpi-game-search");
    if (eG) eG.value = "";
    updateEDPI();
  });

  document.querySelectorAll(".copy-button").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (isCopying) return;
      const isEdpi = this.id === "edpi-copy";
      const val = document.getElementById(isEdpi ? "edpi-value" : "new-sens-value")?.innerText;
      if (!val || val === "0.00" || val === "0") {
        this.classList.add("vibrate");
        setTimeout(() => this.classList.remove("vibrate"), 300);
        return;
      }
      isCopying = true;
      const span = this.querySelector("span");
      const originalText = span ? span.innerText : "";
      navigator.clipboard.writeText(val).then(() => {
        this.classList.add("copied");
        if (span) span.innerText = "COPIED!";
        setTimeout(() => {
          this.classList.remove("copied");
          if (span) span.innerText = originalText;
          isCopying = false;
        }, 1500);
      });
    });
  });

  updateConversion();
  updateEDPI();
});
