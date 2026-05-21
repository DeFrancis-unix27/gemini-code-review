/* ── review.js ── Review Result Page ── */

(function () {
  "use strict";

  /* ── DOM refs ── */
  const codeBlock    = document.getElementById("codeBlock");
  const codeLineNums = document.getElementById("codeLineNums");
  const feedbackPre  = document.getElementById("feedbackPre");
  const copyCodeBtn  = document.getElementById("copyCode");
  const copyFbBtn    = document.getElementById("copyFeedback");
  const toast        = document.getElementById("toast");

  /* ── Line numbers for code block ── */
  function buildLineNumbers(el, container) {
    if (!el || !container) return;
    const lines = el.textContent.split("\n").length;
    container.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join("<br>");
  }

  buildLineNumbers(codeBlock, codeLineNums);

  /* Sync scroll between code block and line numbers */
  if (codeBlock && codeLineNums) {
    const codeWrap = codeBlock.closest(".code-wrap");
    if (codeWrap) {
      codeWrap.addEventListener("scroll", () => {
        codeLineNums.scrollTop = codeWrap.scrollTop;
      });
    }
  }

  /* ── Toast ── */
  let toastTimer = null;

  function showToast(msg) {
    toast.textContent = msg || "Copied!";
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  /* ── Copy helper ── */
  function copyText(text, btn) {
    if (!navigator.clipboard) {
      /* Fallback for older browsers */
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      markCopied(btn);
      return;
    }

    navigator.clipboard.writeText(text).then(() => markCopied(btn));
  }

  function markCopied(btn) {
    const originalHTML = btn.innerHTML;
    btn.classList.add("copied");
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>Copied!</span>
    `;
    showToast("Copied to clipboard!");
    setTimeout(() => {
      btn.classList.remove("copied");
      btn.innerHTML = originalHTML;
    }, 2000);
  }

  /* ── Copy code ── */
  if (copyCodeBtn && codeBlock) {
    copyCodeBtn.addEventListener("click", () => {
      copyText(codeBlock.textContent.trim(), copyCodeBtn);
    });
  }

  /* ── Copy feedback ── */
  if (copyFbBtn && feedbackPre) {
    copyFbBtn.addEventListener("click", () => {
      copyText(feedbackPre.textContent.trim(), copyFbBtn);
    });
  }

  /* ── Feedback syntax highlight ──
     Lightly colour headings and sentiment keywords inside the <pre>.
     Done with a simple text → HTML replacement — no external lib needed. */
  function highlightFeedback(pre) {
    if (!pre) return;

    const raw = pre.textContent;
    const lines = raw.split("\n");

    const html = lines.map((line) => {
      const escaped = escapeHTML(line);

      /* Section headings: lines that start with ##, **, numbers + dot, or === */
      if (/^(#{1,3}|={3,}|\d+\.|[A-Z][A-Z\s]{2,}:)\s/.test(line.trim()) || /^\*\*/.test(line.trim())) {
        return `<span class="fb-heading">${escaped}</span>`;
      }

      /* Positive signals */
      if (/\b(good|great|well|correct|nice|clean|efficient|excellent|pass|✓|✅)\b/i.test(line)) {
        return `<span class="fb-positive">${escaped}</span>`;
      }

      /* Warning signals */
      if (/\b(consider|suggest|improve|could|might|warning|note|tip|⚠️)\b/i.test(line)) {
        return `<span class="fb-warning">${escaped}</span>`;
      }

      /* Error / issue signals */
      if (/\b(bug|error|issue|problem|wrong|bad|avoid|fail|❌|fix)\b/i.test(line)) {
        return `<span class="fb-error">${escaped}</span>`;
      }

      return escaped;
    }).join("\n");

    pre.innerHTML = html;
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  highlightFeedback(feedbackPre);

})();