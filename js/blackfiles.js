(function () {
  const data = BLACKFILES_DATA;

  if (!data || !Array.isArray(data.entities)) {
    console.error("BLACKFILES_DATA not found or invalid");
    return;
  }

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

  function getNodeColor(entity) {
    if (entity.tier === "top") return "#151b2b";
    if (entity.tier === "lieutenant") return "#10182a";
    return "#0d1422";
  }

  function getNodeBorder(entity) {
    if (entity.tier === "top") return "#ff5a7c";
    if (entity.tier === "lieutenant") return "#ff9a6b";
    return "#63a8ff";
  }

  function getNodeSize(entity) {
    if (entity.tier === "top") return 130;
    if (entity.tier === "lieutenant") return 105;
    return 90;
  }

  function getLayoutRoots() {
    const topIds = data.entities
      .filter((entity) => entity.tier === "top")
      .map((entity) => entity.id);

    return topIds.length ? topIds : undefined;
  }

  function initGraph() {
    const graphEl = document.getElementById("graph");

    if (!graphEl) {
      console.error("#graph container not found");
      return;
    }

    const elements = [];

    data.entities.forEach((entity) => {
      elements.push({
        data: {
          id: entity.id,
          label: entity.name,
          role: entity.role || "Unknown Role",
          threat: entity.threat || "low",
          tier: entity.tier || "linked",
          borderColor: getNodeBorder(entity),
          bgColor: getNodeColor(entity),
          size: getNodeSize(entity)
        }
      });
    });

    data.links.forEach((link) => {
      elements.push({
        data: {
          id: `${link.from}_${link.to}`,
          source: link.from,
          target: link.to,
          label: link.label || ""
        }
      });
    });

    const cy = cytoscape({
      container: graphEl,
      elements,
      layout: {
        name: "breadthfirst",
        directed: true,
        roots: getLayoutRoots(),
        padding: 60,
        spacingFactor: 1.25,
        animate: false,
        avoidOverlap: true
      },
      style: [
        {
          selector: "node",
          style: {
            "background-color": "data(bgColor)",
            "label": "data(label)",
            "color": "#e8f0ff",
            "text-valign": "center",
            "text-halign": "center",
            "text-wrap": "wrap",
            "text-max-width": "110px",
            "font-size": 13,
            "font-family": "Inter",
            "width": "data(size)",
            "height": "data(size)",
            "border-width": 3,
            "border-color": "data(borderColor)"
          }
        },
        {
          selector: "edge",
          style: {
            "curve-style": "bezier",
            "width": 2,
            "line-color": "rgba(255,90,124,0.55)",
            "target-arrow-color": "rgba(255,90,124,0.75)",
            "target-arrow-shape": "triangle"
          }
        },
        {
          selector: 'edge[label != ""]',
          style: {
            "label": "data(label)",
            "font-size": 10,
            "color": "#ffd6df",
            "text-background-color": "#0b1018",
            "text-background-opacity": 0.85,
            "text-background-padding": "3px"
          }
        },
        {
          selector: ".dimmed",
          style: {
            "opacity": 0.2
          }
        },
        {
          selector: ".highlighted",
          style: {
            "opacity": 1,
            "line-color": "#ff5a7c",
            "target-arrow-color": "#ff5a7c",
            "width": 3
          }
        }
      ]
    });

    cy.on("tap", "node", (evt) => {
      const node = evt.target;
      const id = node.id();
      const entity = entityMap.get(id);

      cy.elements().removeClass("dimmed highlighted");
      cy.elements().addClass("dimmed");

      node.removeClass("dimmed").addClass("highlighted");
      node.connectedEdges().removeClass("dimmed").addClass("highlighted");
      node.neighborhood().removeClass("dimmed").addClass("highlighted");

      if (entity) openModal(entity);
    });

    cy.on("tap", (evt) => {
      if (evt.target === cy) {
        cy.elements().removeClass("dimmed highlighted");
      }
    });
  }

  function init() {
    updateHeaderInfo();
    animateTraceCode();
    initModal();
    initGraph();
  }

  init();
})();
