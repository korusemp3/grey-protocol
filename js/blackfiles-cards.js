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

  function getTierLabel(tier) {
  const normalized = (tier || "").toLowerCase();
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
  const tierLabel = getTierLabel(entity.tier);

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
      }
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
