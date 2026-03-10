(function () {
  const layer = document.getElementById("cardLayer");

  if (!layer) {
    console.error("#cardLayer not found");
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

  function getThreatClass(threat) {
    const normalized = (threat || "").toLowerCase();
    if (normalized === "critical" || normalized === "high") return "red";
    if (normalized === "medium") return "yellow";
    return "green";
  }

  function getTierClass(tier) {
  const normalized = (tier || "").toLowerCase();
  if (normalized === "top") return "tier-top";
  if (normalized === "lieutenant") return "tier-lieutenant";
  if (normalized === "external") return "tier-external";
  return "tier-linked";
}

  function getTierLabel(entity) {
  if (entity.label && String(entity.label).trim()) {
    return String(entity.label).trim();
  }

  const normalized = (entity.tier || "").toLowerCase();
  if (normalized === "top") return "Top Cell";
  if (normalized === "lieutenant") return "Lieutenant";
  if (normalized === "external") return "External";
  return "Linked Actor";
}

  function buildCard(entity) {
  const card = document.createElement("article");
  card.className = `bf-card ${getTierClass(entity.tier)} threat-${entity.threat}`;
  card.dataset.id = entity.id;

  const threatClass = getThreatClass(entity.threat);
  const threatLabel = (entity.threat || "low").toUpperCase();
  const tierLabel = getTierLabel(entity);

  const photo = entity.image
    ? `<img src="${escapeHtml(entity.image)}" alt="${escapeHtml(entity.name)}">`
    : `${escapeHtml(entity.name ? entity.name.charAt(0).toUpperCase() : "?")}`;

  card.innerHTML = `
    <div class="bf-card__photo">
      ${photo}
      <div class="bf-card__badges">
        <span class="bf-badge ${threatClass}">${escapeHtml(tierLabel)}</span>
        <span class="bf-badge threat-${entity.threat}">${escapeHtml(threatLabel)}</span>
      </div>
    </div>

    <div class="bf-card__body">
      <h4 class="bf-card__name">${escapeHtml(entity.name || "Unknown Subject")}</h4>
      <div class="bf-card__role">${escapeHtml(entity.role || "Unknown Role")}</div>
      <div class="bf-card__summary">${escapeHtml(entity.summary || "No summary available.")}</div>
    </div>
  `;

  let isDragging = false;
  let dragStarted = false;

  card.addEventListener("mousedown", (event) => {
    const cy = window.blackfilesCy;
    if (!cy) return;

    const node = cy.getElementById(entity.id);
    if (!node) return;

    isDragging = true;
    dragStarted = false;

    const graph = document.getElementById("graph");
    const graphRect = graph.getBoundingClientRect();

    function moveAt(e) {
      const x = e.clientX - graphRect.left;
      const y = e.clientY - graphRect.top;

      const pan = cy.pan();
      const zoom = cy.zoom();

      const modelX = (x - pan.x) / zoom;
      const modelY = (y - pan.y) / zoom;

      node.position({ x: modelX, y: modelY });
      dragStarted = true;
    }

    function onMouseMove(e) {
      if (!isDragging) return;
      moveAt(e);
    }

    function onMouseUp() {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);

  isDragging = false;

  if (!dragStarted) {
    node.emit("tap");
    return;
  }

  const finalPos = node.position();
  const x = Math.round(finalPos.x);
  const y = Math.round(finalPos.y);

  const message = `${entity.id}: { x: ${x}, y: ${y} }`;

  console.log(message);

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(message).catch(() => {});
  }

  let hud = document.getElementById("bfCoordHud");
  if (!hud) {
    hud = document.createElement("div");
    hud.id = "bfCoordHud";
    hud.style.position = "fixed";
    hud.style.right = "18px";
    hud.style.bottom = "18px";
    hud.style.zIndex = "99999";
    hud.style.padding = "10px 12px";
    hud.style.borderRadius = "12px";
    hud.style.background = "rgba(8,12,18,.92)";
    hud.style.border = "1px solid rgba(255,90,124,.22)";
    hud.style.boxShadow = "0 10px 30px rgba(0,0,0,.35)";
    hud.style.color = "#ffd6df";
    hud.style.fontFamily = '"JetBrains Mono", monospace';
    hud.style.fontSize = "12px";
    hud.style.letterSpacing = ".04em";
    hud.style.pointerEvents = "none";
    hud.style.whiteSpace = "pre";
    document.body.appendChild(hud);
  }

  hud.textContent = message;
  hud.style.opacity = "1";

  clearTimeout(window.__bfCoordHudTimer);
  window.__bfCoordHudTimer = setTimeout(() => {
    if (hud) hud.style.opacity = "0";
  }, 2200);
}

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    event.preventDefault();
  });

  return card;
}

  function renderCards() {
    layer.innerHTML = "";

    BLACKFILES_DATA.entities.forEach((entity) => {
      const card = buildCard(entity);
      layer.appendChild(card);
    });
  }

  function syncCardPositions() {
  const cy = window.blackfilesCy;
  if (!cy) return;

  const zoom = cy.zoom();

  BLACKFILES_DATA.entities.forEach((entity) => {
    const node = cy.getElementById(entity.id);
    const card = layer.querySelector(`.bf-card[data-id="${entity.id}"]`);

    if (!node || !card) return;

    const pos = node.renderedPosition();

    card.style.left = `${pos.x}px`;
    card.style.top = `${pos.y}px`;
    card.style.transform = `translate(-50%, -50%) scale(${zoom})`;
    card.style.transformOrigin = "center center";
  });
}

  function applyHighlightState() {
    const cy = window.blackfilesCy;
    if (!cy) return;

    layer.querySelectorAll(".bf-card").forEach((card) => {
      card.classList.remove("dimmed", "highlighted");
    });

    const highlightedNodes = cy.nodes(".highlighted");
    const dimmedNodes = cy.nodes(".dimmed");

    highlightedNodes.forEach((node) => {
      const card = layer.querySelector(`.bf-card[data-id="${node.id()}"]`);
      if (card) card.classList.add("highlighted");
    });

    dimmedNodes.forEach((node) => {
      const card = layer.querySelector(`.bf-card[data-id="${node.id()}"]`);
      if (card) card.classList.add("dimmed");
    });
  }

  function attachGraphListeners() {
    const cy = window.blackfilesCy;
    if (!cy) return;

    const updateAll = () => {
      syncCardPositions();
      applyHighlightState();
    };

    cy.on("render position pan zoom", updateAll);
    cy.on("tap", updateAll);
    cy.on("dragfree", "node", updateAll);
    cy.on("layoutstop", updateAll);

    updateAll();
  }

  function initCards() {
    renderCards();
    attachGraphListeners();
    syncCardPositions();
  }

  if (window.blackfilesCy) {
    initCards();
  } else {
    window.addEventListener("blackfiles:graph-ready", initCards, { once: true });
  }
})();
