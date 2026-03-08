(function () {
  const data = window.DOSSIER_DATA;

  if (!data) {
    console.error("DOSSIER_DATA not found");
    return;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function fillText(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value || "";
  }

  function fillHtml(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = value || "";
  }

  function renderPhoto() {
    const el = document.getElementById("dossierPhoto");
    if (!el) return;

    if (data.image) {
      el.innerHTML = `<img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.title)}">`;
    } else {
      el.textContent = data.title ? data.title.charAt(0).toUpperCase() : "?";
    }
  }

  function renderBadges() {
    const el = document.getElementById("dossierBadges");
    if (!el) return;

    el.innerHTML = `
      <span class="dossier-pill">${escapeHtml(data.status || "UNKNOWN")}</span>
      <span class="dossier-pill">${escapeHtml(data.tier || "UNASSIGNED")}</span>
      <span class="dossier-pill dossier-pill--threat">${escapeHtml(data.threat || "LOW")}</span>
    `;
  }

  function renderProfile() {
    const el = document.getElementById("dossierProfile");
    if (!el || !Array.isArray(data.profile)) return;

    el.innerHTML = data.profile.map((item) => `
      <div class="dossier-kv__row">
        <div class="dossier-kv__label">${escapeHtml(item.label)}</div>
        <div class="dossier-kv__value">${escapeHtml(item.value)}</div>
      </div>
    `).join("");
  }

  function renderTags() {
    const el = document.getElementById("dossierTags");
    if (!el || !Array.isArray(data.tags)) return;

    el.innerHTML = data.tags.map((tag) => `
      <span class="dossier-tag">${escapeHtml(tag)}</span>
    `).join("");
  }

  function renderIncidents() {
    const el = document.getElementById("dossierIncidents");
    if (!el || !Array.isArray(data.incidents)) return;

    el.innerHTML = data.incidents.map((item) => `
      <div class="dossier-subcard">
        <div class="dossier-subcard__title">${escapeHtml(item.title)}</div>
        <div class="dossier-subcard__text">${escapeHtml(item.text)}</div>
      </div>
    `).join("");
  }

  function renderConnections() {
    const el = document.getElementById("dossierConnections");
    if (!el || !Array.isArray(data.connections)) return;

    el.innerHTML = data.connections.map((item) => `
      <span class="dossier-tag">${escapeHtml(item)}</span>
    `).join("");
  }

  function init() {
    document.title = `Досье // ${data.title || "Субъект"}`;

    fillText("dossierTitle", data.title || "Неизвестный субъект");
    fillText("dossierRole", data.role || "Неизвестная роль");
    fillText("dossierSummary", (data.summary || "").trim());
    fillText("dossierNotes", (data.notes || "").trim());

    renderPhoto();
    renderBadges();
    renderProfile();
    renderTags();
    renderIncidents();
    renderConnections();
  }

  init();
})();
