"use client";

import { useEffect, useRef } from "react";

/** Vendor-ish hues, mixed so the sphere reads as a many-provider network. */
const PALETTE = [
  [167, 139, 250], // violet
  [96, 165, 250], // blue
  [52, 211, 153], // emerald
  [251, 191, 36], // amber
  [248, 113, 113], // rose
  [125, 211, 252], // sky
  [232, 121, 249], // fuchsia
];

const NODE_COUNT = 460;
const CLUSTER_COUNT = 16;
const EDGE_LIMIT = 700;
const PERSPECTIVE = 900;
const TILT = 0.42;

type Node = {
  x: number;
  y: number;
  z: number;
  color: number[];
  size: number;
  ringed: boolean;
  glow: number;
};

/** Deterministic PRNG so the layout is stable across renders. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildNodes(radius: number): Node[] {
  const random = mulberry32(42);
  const golden = Math.PI * (3 - Math.sqrt(5));

  // Cluster seeds spread evenly, then nodes scatter around them, so the
  // sphere clumps organically instead of looking like a printed grid.
  const clusters = Array.from({ length: CLUSTER_COUNT }, (_, index) => {
    const y = 1 - (index / (CLUSTER_COUNT - 1)) * 2;
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * index;

    return {
      x: Math.cos(theta) * ringRadius,
      y,
      z: Math.sin(theta) * ringRadius,
      color: PALETTE[Math.floor(random() * PALETTE.length)],
    };
  });

  return Array.from({ length: NODE_COUNT }, () => {
    const cluster = clusters[Math.floor(random() * clusters.length)];
    const spread = 0.34 + random() * 0.42;

    // Offset the cluster centre in a random direction, then re-normalise so
    // the node still lands on (or near) the sphere's surface.
    const x = cluster.x + (random() - 0.5) * spread;
    const y = cluster.y + (random() - 0.5) * spread;
    const z = cluster.z + (random() - 0.5) * spread;
    const length = Math.sqrt(x * x + y * y + z * z) || 1;
    const shell = radius * (0.82 + random() * 0.21);
    const large = random() > 0.9;

    return {
      x: (x / length) * shell,
      y: (y / length) * shell,
      z: (z / length) * shell,
      color:
        random() > 0.35
          ? cluster.color
          : PALETTE[Math.floor(random() * PALETTE.length)],
      size: large ? 3.4 + random() * 2.4 : 0.9 + random() * 2.1,
      ringed: random() > 0.95,
      glow: large ? 7 + random() * 7 : 0,
    };
  });
}

function buildEdges(nodes: Node[], radius: number) {
  const threshold = radius * 0.36;
  const edges: [number, number][] = [];

  for (let i = 0; i < nodes.length && edges.length < EDGE_LIMIT; i += 1) {
    for (let j = i + 1; j < nodes.length && edges.length < EDGE_LIMIT; j += 1) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dz = nodes[i].z - nodes[j].z;

      if (Math.sqrt(dx * dx + dy * dy + dz * dz) < threshold) {
        edges.push([i, j]);
      }
    }
  }

  return edges;
}

export function ModelGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let radius = 0;
    let nodes: Node[] = [];
    let edges: [number, number][] = [];
    let frame = 0;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);

      radius = Math.min(width, height) * 0.42;
      nodes = buildNodes(radius);
      edges = buildEdges(nodes, radius);
    }

    function draw(time: number) {
      const angle = reduceMotion ? 0.6 : (time / 1000) * 0.075;
      const cx = width / 2;
      const cy = height / 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const cosTilt = Math.cos(TILT);
      const sinTilt = Math.sin(TILT);

      const projected = nodes.map((node) => {
        // Spin around Y, then tilt around X so the sphere reads as a dome.
        const x = node.x * cos - node.z * sin;
        const zSpun = node.x * sin + node.z * cos;
        const y = node.y * cosTilt - zSpun * sinTilt;
        const z = node.y * sinTilt + zSpun * cosTilt;
        const scale = PERSPECTIVE / (PERSPECTIVE - z);

        return {
          node,
          sx: cx + x * scale,
          sy: cy + y * scale,
          scale,
          depth: (z + radius) / (radius * 2),
        };
      });

      context!.clearRect(0, 0, width, height);

      for (const [from, to] of edges) {
        const a = projected[from];
        const b = projected[to];
        const alpha = Math.min(a.depth, b.depth) * 0.16;
        if (alpha <= 0.01) continue;

        context!.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
        context!.lineWidth = 0.5;
        context!.beginPath();
        context!.moveTo(a.sx, a.sy);
        context!.lineTo(b.sx, b.sy);
        context!.stroke();
      }

      // Painter's algorithm: far nodes first, so near ones sit on top.
      for (const item of projected.sort((a, b) => a.depth - b.depth)) {
        const [r, g, b] = item.node.color;
        const alpha = 0.16 + item.depth * 0.8;
        const size = item.node.size * item.scale;

        // Far nodes bloom slightly, which reads as depth-of-field blur.
        context!.shadowBlur = item.node.glow * (1.4 - item.depth);
        context!.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        context!.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        context!.beginPath();
        context!.arc(item.sx, item.sy, size, 0, Math.PI * 2);
        context!.fill();
        context!.shadowBlur = 0;

        if (item.node.ringed && item.depth > 0.55) {
          context!.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`;
          context!.lineWidth = 1;
          context!.beginPath();
          context!.arc(item.sx, item.sy, size + 4.5, 0, Math.PI * 2);
          context!.stroke();
        }
      }

      if (!reduceMotion) {
        frame = requestAnimationFrame(draw);
      }
    }

    const observer = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(0);
    });

    resize();
    observer.observe(canvas);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="size-full"
      style={{
        maskImage:
          "radial-gradient(circle at 50% 50%, black 55%, transparent 92%)",
        WebkitMaskImage:
          "radial-gradient(circle at 50% 50%, black 55%, transparent 92%)",
      }}
    />
  );
}
