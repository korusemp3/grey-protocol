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
    modalSummary.innerHTML = entity.summary || "No summary available.";
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
    if (window.blackfilesCy) {
    window.blackfilesCy.elements().removeClass("dimmed highlighted");
  }
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
    if (entity.tier === "external") return "#1a1020";
    return "#0d1422";
  }

  function getNodeBorder(entity) {
    if (entity.tier === "top") return "#ff5a7c";
    if (entity.tier === "lieutenant") return "#ff9a6b";
    if (entity.tier === "external") return "#b388ff";
    return "#63a8ff";
  }

  function getNodeSize(entity) {
    if (entity.tier === "top") return 130;
    if (entity.tier === "lieutenant") return 105;
    if (entity.tier === "external") return 100;
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
    const presetPositions = getPresetPositions();

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
  },
  position: presetPositions[entity.id]
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
      minZoom: 0.5,
      maxZoom: 2.2,
      wheelSensitivity: 0.14,
      layout: {
  name: "preset",
  fit: true,
  padding: 120,
  animate: false
},
      style: [
        {
  selector: "node",
  style: {
    "background-opacity": 0,
    "border-opacity": 0,
    "label": "",
    "width": 1,
    "height": 1
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

    function clearAnalysisState() {
  cy.elements().removeClass("dimmed highlighted");
}

function applyAnalysisState(node) {
  clearAnalysisState();
  cy.elements().addClass("dimmed");

  node.removeClass("dimmed").addClass("highlighted");
  node.connectedEdges().removeClass("dimmed").addClass("highlighted");
  node.neighborhood().removeClass("dimmed").addClass("highlighted");
}

cy.on("tap", "node", (evt) => {
  const node = evt.target;
  const id = node.id();
  const entity = entityMap.get(id);

  clearAnalysisState();

  if (entity) openModal(entity);
});

cy.on("cxttap", "node", (evt) => {
  const node = evt.target;
  applyAnalysisState(node);
});

cy.on("tap", (evt) => {
  if (evt.target === cy) {
    clearAnalysisState();
  }
});

cy.on("cxttap", (evt) => {
  if (evt.target === cy) {
    clearAnalysisState();
  }
});
    window.blackfilesCy = cy;
window.dispatchEvent(new CustomEvent("blackfiles:graph-ready"));
  }
  
  function getPresetPositions() {
  const positions = {};

  const grouped = {
    top: [],
    lieutenants: [],
    linked: [],
    external: []
  };

  data.entities.forEach((entity) => {
    // 1. если задана ручная позиция — она главная
    if (typeof entity.x === "number" && typeof entity.y === "number") {
      positions[entity.id] = {
        x: entity.x,
        y: entity.y
      };
      return;
    }

    // 2. иначе раскладываем по layoutGroup
    const group = entity.layoutGroup || "linked";

    if (!grouped[group]) {
      grouped.linked.push(entity);
      return;
    }

    if (grouped[group]) {
      grouped[group].push(entity);
    } else {
      grouped.linked.push(entity);
    }
  });

  function placeRow(items, y, startX, gap) {
    items.forEach((item, index) => {
      if (!positions[item.id]) {
        positions[item.id] = {
          x: startX + index * gap,
          y
        };
      }
    });
  }

  // верхний ряд
  placeRow(grouped.top, 180, 700, 220);

  // лейтенанты
  placeRow(grouped.lieutenants, 520, 260, 240);

  // связанные / ресурсы / нижний ряд
  placeRow(grouped.linked, 860, 160, 220);

  // внешние
  placeRow(grouped.external, 80, 220, 220);

  return positions;
}
  
  function init() {
    updateHeaderInfo();
    animateTraceCode();
    initModal();
    initLegendToggle();
    initGraph();
  }

  function initLegendToggle() {
  const toggle = document.getElementById("legendToggle");
  const legend = document.getElementById("threatLegend");

  if (!toggle || !legend) return;

  toggle.addEventListener("click", () => {
    legend.classList.toggle("is-collapsed");
  });
}
  
  init();
})();
