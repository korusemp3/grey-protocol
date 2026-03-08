(function () {
  const data = BLACKFILES_DATA;

  if (!data || !Array.isArray(data.entities)) {
    console.error("BLACKFILES_DATA not found or invalid");
    return;
  }

  const nodeLayer = document.getElementById("nodeLayer");
  const connectionLayer = document.getElementById("connectionLayer");
  const trackedCount = document.getElementById("trackedCount");
  const topNodeLabel = document.getElementById("topNodeLabel");
  const traceCode = document.getElementById("traceCode");

  const modal = document.getElementById("entityModal");
  const modalClose = document.getElementById("modalClose");
  const modalName = document.getElementById("modalName");
  const modalRole = document.getElementById("modalRole");
  const modalPhoto = document.getElementById("modalPhoto");
  const modalMeta = document.getElementById("modalMeta");
  const modalSummary = document.getElementById("modalSummary");
  const modalConnections = document.getElementById("modalConnections");
  const modalDossierLink = document.getElementById("modalDossierLink");

  const entityMap = new Map(data.entities.map((entity) => [entity.id, entity]));

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

  function getTierLabel(tier) {
    const normalized = (tier || "").toLowerCase();
    if (normalized === "top") return "Top Cell";
    if (normalized === "lieutenant") return "Lieutenant";
    return "Linked Actor";
  }

  function getRoleLabel(role) {
    return role || "Unknown Role";
  }

  function getFallbackImageMarkup(name) {
    const initial = name ? name.trim().charAt(0).toUpperCase() : "?";
    return `<div class="entity-photo">${escapeHtml(initial || "?")}</div>`;
  }

  function createEntityNode(entity) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `entity-node ${entity.tier === "top" ? "top" : ""}`;
    button.style.left = `${entity.position.x}%`;
    button.style.top = `${entity.position.y}%`;
    button.style.transform = "translate(-50%, 0)";

    const threatClass = getThreatClass(entity.threat);
    const tierLabel = getTierLabel(entity.tier);
    const threatLabel = (entity.threat || "low").toUpperCase();

    let photoMarkup = "";
    if (entity.image) {
      photoMarkup = `
        <div class="entity-photo">
          <img src="${escapeHtml(entity.image)}" alt="${escapeHtml(entity.name)}">
          <div class="entity-badges">
            <span class="badge ${threatClass}">${escapeHtml(tierLabel)}</span>
            <span class="badge ${threatClass}">${escapeHtml(threatLabel)}</span>
          </div>
        </div>
      `;
    } else {
      photoMarkup = `
        <div class="entity-photo">
          ${escapeHtml(entity.name ? entity.name.charAt(0).toUpperCase() : "?")}
          <div class="entity-badges">
            <span class="badge ${threatClass}">${escapeHtml(tierLabel)}</span>
            <span class="badge ${threatClass}">${escapeHtml(threatLabel)}</span>
          </div>
        </div>
      `;
    }

    button.innerHTML = `
      ${photoMarkup}
      <div class="entity-body">
        <h4 class="entity-name">${escapeHtml(entity.name)}</h4>
        <div class="entity-role">${escapeHtml(getRoleLabel(entity.role))}</div>
        <div class="entity-summary">${escapeHtml(entity.summary || "No summary available.")}</div>
      </div>
    `;

    button.addEventListener("click", () => openModal(entity));
    return button;
  }

  function layoutEntities() {
  const tiers = {
    top: data.entities.filter((e) => e.tier === "top"),
    lieutenant: data.entities.filter((e) => e.tier === "lieutenant"),
    linked: data.entities.filter((e) => e.tier === "linked")
  };

  const tierY = {
  top: 6,
  lieutenant: 38,
  linked: 72
};

  function spread(items, y) {

  if (!items.length) return;

  const containerWidth = 100;
  const cardWidth = 14; // ширина карточки в процентах

  const totalWidth = items.length * cardWidth;
  const gap = (containerWidth - totalWidth) / (items.length + 1);

  items.forEach((item, index) => {

    const x = gap + index * (cardWidth + gap) + cardWidth / 2;

    item.position = {
      x,
      y
    };

  });

}

  spread(tiers.top, tierY.top);
  spread(tiers.lieutenant, tierY.lieutenant);
  spread(tiers.linked, tierY.linked);
}
  
  function renderNodes() {
    nodeLayer.innerHTML = "";
    data.entities.forEach((entity) => {
      const node = createEntityNode(entity);
      nodeLayer.appendChild(node);
    });
  }

  function getNodeCenter(entity) {
    const isTop = entity.tier === "top";
    const width = isTop ? 320 : 260;
    const height = 180 + 120;
    const left = entity.position.x;
    const top = entity.position.y;

    const centerX = left;
    const centerY = top + (height / 2 / 700) * 100;

    return { x: centerX, y: centerY };
  }

  function drawConnections() {
    if (!connectionLayer) return;

    const board = document.querySelector(".board");
    const boardRect = board.getBoundingClientRect();
    const width = boardRect.width;
    const height = boardRect.height;

    connectionLayer.setAttribute("viewBox", `0 0 ${width} ${height}`);
    connectionLayer.innerHTML = "";

    data.links.forEach((link) => {
      const fromEntity = entityMap.get(link.from);
      const toEntity = entityMap.get(link.to);

      if (!fromEntity || !toEntity) return;

      const fromNode = nodeLayer.querySelector(`[data-id="${link.from}"]`);
      const toNode = nodeLayer.querySelector(`[data-id="${link.to}"]`);

      const fromEl = Array.from(nodeLayer.children).find((el) => {
        const title = el.querySelector(".entity-name");
        return title && title.textContent === fromEntity.name;
      });

      const toEl = Array.from(nodeLayer.children).find((el) => {
        const title = el.querySelector(".entity-name");
        return title && title.textContent === toEntity.name;
      });

      if (!fromEl || !toEl) return;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      const startX = fromRect.left - boardRect.left + fromRect.width / 2;
      const startY = fromRect.top - boardRect.top + fromRect.height;
      const endX = toRect.left - boardRect.left + toRect.width / 2;
      const endY = toRect.top - boardRect.top;

      const midY = (startY + endY) / 2;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute(
        "d",
        `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`
      );
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "rgba(255,90,124,.28)");
      path.setAttribute("stroke-width", "2");

      connectionLayer.appendChild(path);

      if (link.label) {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", String((startX + endX) / 2));
        text.setAttribute("y", String(midY - 6));
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "rgba(255,190,205,.88)");
        text.setAttribute("font-size", "11");
        text.setAttribute("font-family", "JetBrains Mono, monospace");
        text.textContent = link.label;
        connectionLayer.appendChild(text);
      }
    });
  }

  function buildMeta(entity) {
    const items = [
      entity.status || "unknown",
      entity.tier || "linked",
      `threat: ${entity.threat || "low"}`
    ];

    return items
      .map((item) => `<span class="mini-pill">${escapeHtml(item)}</span>`)
      .join("");
  }

  function getConnectionsText(entityId) {
    const related = data.links
      .filter((link) => link.from === entityId || link.to === entityId)
      .map((link) => {
        const otherId = link.from === entityId ? link.to : link.from;
        const other = entityMap.get(otherId);
        return other ? other.name : null;
      })
      .filter(Boolean);

    if (!related.length) return "No confirmed connections.";

    return related.join(" / ");
  }

  function openModal(entity) {
    modalName.textContent = entity.name || "Unknown Subject";
    modalRole.textContent = entity.role || "Unknown Role";
    modalMeta.innerHTML = buildMeta(entity);
    modalSummary.textContent = entity.summary || "No summary available.";
    modalConnections.textContent = entity.notes || getConnectionsText(entity.id);
    modalDossierLink.setAttribute("href", entity.dossier || "#");

    if (entity.image) {
      modalPhoto.innerHTML = `<img src="${escapeHtml(entity.image)}" alt="${escapeHtml(entity.name)}">`;
      modalPhoto.classList.remove("placeholder");
    } else {
      modalPhoto.textContent = entity.name ? entity.name.charAt(0).toUpperCase() : "?";
      modalPhoto.classList.add("placeholder");
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function updateHeaderInfo() {
    trackedCount.textContent = String(data.entities.length).padStart(2, "0");
    const topEntity = data.entities.find((entity) => entity.tier === "top");
    if (topEntity) {
      topNodeLabel.textContent = topEntity.name;
    }
  }

  function animateTraceCode() {
    if (!traceCode) return;
    const chars = "ABCDEF0123456789";

    function makeCode() {
      let raw = "";
      for (let i = 0; i < 6; i++) {
        raw += chars[Math.floor(Math.random() * chars.length)];
      }
      return "BF-" + raw.slice(0, 4) + "-" + raw.slice(4);
    }

    setInterval(() => {
      traceCode.textContent = makeCode();
    }, 1600);
  }

  function addDataIdsToNodes() {
    const nodes = nodeLayer.querySelectorAll(".entity-node");
    nodes.forEach((node, index) => {
      const entity = data.entities[index];
      if (entity) {
        node.dataset.id = entity.id;
      }
    });
  }

  function initModal() {
    modalClose.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("open")) {
        closeModal();
      }
    });
  }

  function init() {
    layoutEntities();
    renderNodes();
    addDataIdsToNodes();
    updateHeaderInfo();
    animateTraceCode();
    initModal();

    requestAnimationFrame(() => {
      drawConnections();
    });

    window.addEventListener("resize", drawConnections);
  }

  init();
})();
