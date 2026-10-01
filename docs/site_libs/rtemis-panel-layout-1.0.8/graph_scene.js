// Shared graph materialization and visual attributes for Sigma and SVG.
// Uses the same Graphology algorithms as the live viewer. A local seeded RNG
// makes repeated browser draws and offline exports reproduce the same layout.
(function(root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory;
  else root.RtemisGraphScene = factory(root.RtemisGraph);
})(typeof globalThis !== "undefined" ? globalThis : this, function(deps) {
  const {Graph, louvain, forceAtlas2, circlepack, random} = deps;
    const paletteColor = (palette, i) => {
      const n = palette.length;
      return palette[((i % n) + n) % n];
    };
    const NEUTRAL_EDGE = "#9aa0a6";
    const withAlpha = (hex, alpha255) => {
      const a = Math.max(0, Math.min(255, Math.round(alpha255)));
      return `${hex}${a.toString(16).padStart(2, "0")}`;
    };
    const blendHex = (a, b) => {
      const pa = parseInt(a.slice(1), 16);
      const pb = parseInt(b.slice(1), 16);
      const r = ((pa >> 16) + (pb >> 16)) >> 1;
      const g = (((pa >> 8) & 0xff) + ((pb >> 8) & 0xff)) >> 1;
      const bl = ((pa & 0xff) + (pb & 0xff)) >> 1;
      return `#${((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)}`;
    };


  function create(model, s, theme) {
    const nodes = model.nodes || [], edges = model.edges || [];
    const palette = s.palette || ["#6CA3A0"];
    let seed = 1;
    const rng = () => { seed = (Math.imul(1664525, seed) + 1013904223) >>> 0; return seed / 4294967296; };
      const graph = new Graph({ type: model.directed ? "directed" : "undirected" });

      const maxValue = nodes.reduce((m, n) => Math.max(m, n.value || 0), 1);
      const nn = nodes.length;
      nodes.forEach((node, i) => {
        const angle = (2 * Math.PI * i) / nn;
        graph.addNode(node.id, {
          label: node.label != null ? node.label : node.id,
          x: Math.cos(angle),
          y: Math.sin(angle),
          value: node.value || 0,
          valueNorm: (node.value || 0) / maxValue,
          group: node.group != null ? node.group : null,
          community: 0,
        });
      });

      const maxWeight = edges.reduce(
        (m, e) => Math.max(m, Math.abs(e.weight != null ? e.weight : 1)),
        1e-9,
      );
      for (const e of edges) {
        if (!graph.hasNode(e.source) || !graph.hasNode(e.target)) continue;
        if (graph.hasEdge(e.source, e.target)) continue;
        const sign = e.sign != null ? e.sign : 0;
        const weightNorm = Math.abs(e.weight != null ? e.weight : 1) / maxWeight;
        graph.addEdgeWithKey(String(graph.size), e.source, e.target, {
          weightNorm,
          sign,
          // Louvain only supports non-negative weights; clamp negatives to 0 so
          // anti-correlated nodes are not pulled together (same compromise as
          // rtemislive's GraphCanvas).
          louvainWeight: sign < 0 ? 0 : weightNorm,
        });
      }

      // Community detection (always computed; coloring decides whether to use).
      if (graph.size > 0 && louvain) {
        louvain.assign(graph, {
          nodeCommunityAttribute: "community",
          getEdgeWeight: "louvainWeight",
          resolution: s.resolution != null ? s.resolution : 1,
          rng,
        });
      }

      // ── Layout ──────────────────────────────────────────────────────────
      const layout = s.layout || "force";
      if (layout === "circular") {
        const ids = graph.nodes();
        ids.sort(
          (a, b) =>
            graph.getNodeAttribute(a, "community") -
            graph.getNodeAttribute(b, "community"),
        );
        ids.forEach((id, i) => {
          const angle = (2 * Math.PI * i) / ids.length;
          graph.setNodeAttribute(id, "x", Math.cos(angle));
          graph.setNodeAttribute(id, "y", Math.sin(angle));
        });
      } else if (layout === "circlepack" && circlepack) {
        circlepack.assign(graph, { hierarchyAttributes: ["community"], rng });
      } else if (layout === "random" && random) {
        random.assign(graph, { rng });
      } else if (graph.order > 0 && forceAtlas2) {
        forceAtlas2.assign(graph, {
          iterations: 200,
          settings: { ...forceAtlas2.inferSettings(graph), scalingRatio: 10 },
        });
      }

      let minX = Infinity, maxX = -Infinity;
      graph.forEachNode((id, attrs) => { minX = Math.min(minX, attrs.x); maxX = Math.max(maxX, attrs.x); });
      const centerX = graph.order ? (minX + maxX)/2 : 0;
      const colorByGroup = !!s.colorByGroup;
      const nodeColorFor = (community) =>
        colorByGroup ? paletteColor(palette, community) : s.nodeColor || palette[0];

      let hovered = null;

    return {graph, setHovered(value) { hovered = value; },
        nodeReducer: (key, data) => {
          const attrs = graph.getNodeAttributes(key);
          const base = s.nodeSize != null ? s.nodeSize : 10;
          const size =
            s.scaleByDegree !== false
              ? Math.max(1, base * (0.5 + (attrs.valueNorm || 0)))
              : base;
          const res = {
            ...data,
            size,
            color: nodeColorFor(attrs.community || 0),
            opacity: s.nodeOpacity != null ? s.nodeOpacity : 0.95,
            // Point labels toward the graph interior at the right edge.
            labelPosition: attrs.x > centerX ? "left" : "right",
            labelColor: theme.fg,
            labelFont: theme.fontFamily,
          };
          if (hovered && hovered !== key && !graph.areNeighbors(hovered, key)) {
            res.color = withAlpha(palette[0], 40);
            res.opacity = 0.15;
            res.label = "";
          }
          return res;
        },
        edgeReducer: (key, data) => {
          const attrs = graph.getEdgeAttributes(key);
          const size = Math.max(
            0.5,
            (attrs.weightNorm != null ? attrs.weightNorm : 0.5) *
              (s.edgeScale != null ? s.edgeScale : 3),
          );
          let color;
          if (s.blendEdges) {
            const ext = graph.extremities(key);
            color = blendHex(
              nodeColorFor(graph.getNodeAttribute(ext[0], "community")),
              nodeColorFor(graph.getNodeAttribute(ext[1], "community")),
            );
          } else {
            const sign = attrs.sign;
            color =
              sign > 0
                ? s.positiveColor || palette[0]
                : sign < 0
                  ? s.negativeColor || NEUTRAL_EDGE
                  : NEUTRAL_EDGE;
          }
          const res = {
            ...data,
            size,
            color,
            opacity: s.edgeOpacity != null ? s.edgeOpacity : 0.4,
          };
          if (hovered && !graph.extremities(key).includes(hovered)) {
            res.opacity = Math.min(
              s.edgeOpacity != null ? s.edgeOpacity : 0.4,
              0.06,
            );
          }
          return res;
        },
    };
  }
  return {create};
});
