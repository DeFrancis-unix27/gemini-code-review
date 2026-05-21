/* ── scripts.js ── Gemini Code Reviewer ── */
 
(function () {
  "use strict";
 
  /* ── DOM refs ── */
  const langInput   = document.getElementById("language");
  const codeArea    = document.getElementById("code");
  const lineNums    = document.getElementById("lineNumbers");
  const charCount   = document.getElementById("charCount");
  const lineCount   = document.getElementById("lineCount");
  const pills       = document.querySelectorAll(".pill");
  const form        = document.getElementById("reviewForm");
  const submitBtn   = document.getElementById("submitBtn");
  const btnLoader   = document.getElementById("btnLoader");
 
  /* ── Language pills ── */
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      langInput.value = pill.dataset.lang;
      langInput.dispatchEvent(new Event("input"));
    });
  });
 
  /* Deactivate pill if user types manually */
  langInput.addEventListener("input", () => {
    pills.forEach((p) => {
      const match = p.dataset.lang.toLowerCase() === langInput.value.toLowerCase();
      p.classList.toggle("active", match);
    });
  });
 
  /* ── Line numbers ── */
  function updateLineNumbers() {
    const lines = codeArea.value.split("\n").length;
    lineNums.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join("<br>");
  }
 
  /* ── Stats (chars + lines) ── */
  function updateStats() {
    const chars = codeArea.value.length;
    const lines = codeArea.value === "" ? 0 : codeArea.value.split("\n").length;
 
    charCount.textContent = chars === 1 ? "1 character" : `${chars.toLocaleString()} characters`;
    lineCount.textContent = lines === 1 ? "1 line"      : `${lines.toLocaleString()} lines`;
 
    /* Colour hint when there's content */
    const hasContent = chars > 0;
    charCount.style.color = hasContent ? "var(--accent2)" : "var(--muted)";
    lineCount.style.color  = hasContent ? "var(--accent)"  : "var(--muted)";
  }
 
  /* Sync textarea scroll → line numbers scroll */
  function syncScroll() {
    lineNums.scrollTop = codeArea.scrollTop;
  }
 
  codeArea.addEventListener("input", () => {
    updateLineNumbers();
    updateStats();
  });
 
  codeArea.addEventListener("scroll", syncScroll);
 
  /* Initialise on page load */
  updateLineNumbers();
  updateStats();
 
  /* ── Tab key support in textarea ── */
  codeArea.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = codeArea.selectionStart;
      const end   = codeArea.selectionEnd;
      codeArea.value =
        codeArea.value.substring(0, start) + "  " + codeArea.value.substring(end);
      codeArea.selectionStart = codeArea.selectionEnd = start + 2;
      updateLineNumbers();
      updateStats();
    }
  });
 
  /* ── Form submit — loading state ── */
  form.addEventListener("submit", (e) => {
    /* Basic client-side guard */
    if (!langInput.value.trim() || !codeArea.value.trim()) {
      e.preventDefault();
      shakeField(!langInput.value.trim() ? langInput : codeArea);
      return;
    }
 
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;
  });
 
  /* Shake animation for empty required fields */
  function shakeField(el) {
    el.style.borderColor = "var(--danger)";
    el.style.animation = "shake 0.35s ease";
    el.addEventListener("animationend", () => {
      el.style.animation = "";
      setTimeout(() => { el.style.borderColor = ""; }, 1200);
    }, { once: true });
  }
 
  /* Inject shake keyframe dynamically (keeps CSS clean) */
  const shakeStyle = document.createElement("style");
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); }
      40%       { transform: translateX(6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(shakeStyle);
 
  /* ── Paste detection — auto-detect language hint ── */
  const langGuessMap = {
    "def ":        "Python",
    "import ":     "Python",
    "print(":      "Python",
    "function ":   "JavaScript",
    "const ":      "JavaScript",
    "console.log": "JavaScript",
    "interface ":  "TypeScript",
    ": string":    "TypeScript",
    "func ":       "Go",
    "fmt.":        "Go",
    "fn ":         "Rust",
    "let mut":     "Rust",
    "public class":"Java",
    "System.out":  "Java",
    "#include":    "C++",
    "cout":        "C++",
    "<?php":       "PHP",
    "echo ":       "PHP",
  };
 
  codeArea.addEventListener("paste", () => {
    if (langInput.value.trim()) return;  /* user already picked */
    requestAnimationFrame(() => {
      const sample = codeArea.value.slice(0, 300);
      for (const [sig, lang] of Object.entries(langGuessMap)) {
        if (sample.includes(sig)) {
          langInput.value = lang;
          /* Sync pill highlight */
          pills.forEach((p) => p.classList.toggle("active", p.dataset.lang === lang));
          break;
        }
      }
    });
  });
 
})();
 