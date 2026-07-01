import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import { collectFlowTreeTargets, loadWiki } from "@wdd/harness";

const repoRoot = process.cwd();
const wikiRoot = path.resolve(repoRoot, "wiki");
const viewport = { width: 1800, height: 1200 };

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function normalizePath(value) {
  return value.replaceAll("\\", "/");
}

function comparableAssetPath(value) {
  return normalizePath(value)
    .replace(/^(\.\/)+/, "")
    .replace(/^(\.\.\/)+/, "")
    .replace(/^wiki\//, "");
}

function screenForSource(screens, sourcePath) {
  const sourceKey = comparableAssetPath(sourcePath);
  return screens.find((screen) => comparableAssetPath(screen.screenshotPath).endsWith(sourceKey) || sourceKey.endsWith(comparableAssetPath(screen.screenshotPath)));
}

function stripHtml(value) {
  return value
    .replace(/<img\b[^>]*>/gi, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replaceAll("&quot;", '"')
    .trim();
}

function parseMermaidSource(target) {
  const nodes = new Map();
  const edges = [];
  const selfEdges = new Map();

  for (const rawLine of target.source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("flowchart") || line.startsWith("graph")) continue;

    const nodeMatch = line.match(/^([A-Za-z0-9_]+)\s*\["([\s\S]*)"]$/);
    if (nodeMatch) {
      const [, id, labelHtml] = nodeMatch;
      const src = labelHtml.match(/<img\b[^>]*\bsrc=['"]([^'"]+)['"][^>]*>/i)?.[1];
      const screen = src ? screenForSource(target.screens, src) : undefined;
      nodes.set(id, {
        id,
        label: stripHtml(labelHtml) || screen?.title || id,
        screen
      });
      continue;
    }

    const labeledEdge = line.match(/^([A-Za-z0-9_]+)\s*-->\|([^|]+)\|\s*([A-Za-z0-9_]+)/);
    const plainEdge = line.match(/^([A-Za-z0-9_]+)\s*-->\s*([A-Za-z0-9_]+)/);
    const edge = labeledEdge
      ? { from: labeledEdge[1], label: labeledEdge[2].trim(), to: labeledEdge[3] }
      : plainEdge
        ? { from: plainEdge[1], label: "", to: plainEdge[2] }
        : undefined;

    if (!edge) continue;
    if (edge.from === edge.to) {
      const notes = selfEdges.get(edge.from) ?? [];
      notes.push(edge.label || "same screen state");
      selfEdges.set(edge.from, notes);
    } else {
      edges.push(edge);
    }
  }

  if (!nodes.size) {
    for (const [index, screen] of target.screens.entries()) {
      const id = `screen${index + 1}`;
      nodes.set(id, { id, label: screen.title, screen });
      if (index > 0) edges.push({ from: `screen${index}`, label: "", to: id });
    }
  }

  return { nodes, edges, selfEdges };
}

function dataUrlForScreenshot(screen) {
  const filePath = path.resolve(repoRoot, screen.screenshotPath);
  const extension = path.extname(filePath).toLowerCase();
  const mimeType = extension === ".jpg" || extension === ".jpeg" ? "image/jpeg" : "image/png";
  return `data:${mimeType};base64,${fs.readFileSync(filePath).toString("base64")}`;
}

function renderNodeCard(node, notes) {
  const image = node.screen
    ? `<img src="${dataUrlForScreenshot(node.screen)}" alt="${escapeHtml(node.screen.alt ?? node.label)}" />`
    : `<div class="missing-shot">No screenshot</div>`;
  const noteMarkup = notes?.length
    ? `<div class="state-notes">${notes.map((note) => `<span>${escapeHtml(note)}</span>`).join("")}</div>`
    : "";

  return `
    <div class="screen-card">
      <div class="shot">${image}</div>
      <div class="screen-title">${escapeHtml(node.label)}</div>
      ${node.screen ? `<div class="screen-id">${escapeHtml(node.screen.nodeId)}</div>` : ""}
      ${noteMarkup}
    </div>
  `;
}

function renderTreeNode(nodeId, graph, seen = new Set()) {
  const node = graph.nodes.get(nodeId);
  if (!node) return "";
  if (seen.has(nodeId)) {
    return `<div class="cycle-ref">${escapeHtml(node.label)}</div>`;
  }

  const nextSeen = new Set(seen);
  nextSeen.add(nodeId);
  const children = graph.edges.filter((edge) => edge.from === nodeId);

  return `
    <div class="tree-node">
      ${renderNodeCard(node, graph.selfEdges.get(nodeId))}
      ${
        children.length
          ? `<div class="children">${children
              .map(
                (edge) => `
                  <div class="branch">
                    <div class="edge-label">${escapeHtml(edge.label || "next")}</div>
                    ${renderTreeNode(edge.to, graph, nextSeen)}
                  </div>
                `
              )
              .join("")}</div>`
          : ""
      }
    </div>
  `;
}

function renderFlowTreePage(target) {
  const graph = parseMermaidSource(target);
  const incoming = new Set(graph.edges.map((edge) => edge.to));
  const roots = [...graph.nodes.keys()].filter((nodeId) => !incoming.has(nodeId));
  const rootIds = roots.length ? roots : [...graph.nodes.keys()].slice(0, 1);

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<style>
  :root {
    --bg: #f6f8fb;
    --panel: #ffffff;
    --ink: #182033;
    --muted: #667085;
    --line: #cbd5e1;
    --accent: #2563eb;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 28px;
    background: var(--bg);
    color: var(--ink);
    font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard", "Segoe UI", sans-serif;
  }
  .flow-board {
    display: inline-block;
    min-width: 1120px;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 22px 26px 30px;
  }
  .header h1 {
    margin: 0;
    font-size: 22px;
    letter-spacing: 0;
  }
  .header p {
    margin: 6px 0 20px;
    color: var(--muted);
    font-size: 13px;
  }
  .roots {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 36px;
  }
  .tree-node {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .screen-card {
    width: 220px;
    border: 1px solid var(--line);
    border-top: 4px solid var(--accent);
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 8px rgba(15, 23, 42, .08);
  }
  .shot {
    aspect-ratio: 4 / 3;
    background: #f8fafc;
    overflow: hidden;
    border-bottom: 1px solid #e2e8f0;
  }
  .shot img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: top center;
  }
  .missing-shot {
    display: grid;
    height: 100%;
    place-items: center;
    color: var(--muted);
    font-size: 12px;
  }
  .screen-title {
    display: grid;
    min-height: 42px;
    place-items: center;
    padding: 8px 10px 2px;
    font-size: 14px;
    font-weight: 750;
    text-align: center;
    line-height: 1.25;
  }
  .screen-id {
    min-height: 24px;
    padding: 0 10px 8px;
    color: var(--muted);
    font-size: 10px;
    text-align: center;
  }
  .state-notes {
    display: grid;
    gap: 4px;
    padding: 0 10px 10px;
  }
  .state-notes span {
    display: block;
    border-radius: 999px;
    background: #eef4ff;
    color: #1d4ed8;
    padding: 3px 7px;
    font-size: 10px;
    font-weight: 700;
    text-align: center;
  }
  .children {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 24px;
    padding-top: 32px;
    margin-top: 16px;
  }
  .children::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 32px;
    background: var(--line);
  }
  .branch {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 22px;
  }
  .branch::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 22px;
    background: var(--line);
  }
  .children .branch::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--line);
  }
  .children .branch:first-child::after { left: 50%; }
  .children .branch:last-child::after { right: 50%; }
  .children .branch:only-child::after { display: none; }
  .edge-label {
    position: relative;
    z-index: 1;
    max-width: 170px;
    margin-bottom: 10px;
    border-radius: 999px;
    background: var(--accent);
    color: #fff;
    padding: 5px 10px;
    font-size: 11px;
    font-weight: 800;
    text-align: center;
    line-height: 1.25;
    white-space: normal;
  }
  .cycle-ref {
    border: 1px dashed var(--line);
    border-radius: 10px;
    padding: 14px 18px;
    color: var(--muted);
    background: #f8fafc;
    font-size: 12px;
  }
</style>
</head>
<body>
  <div class="flow-board">
    <div class="header">
      <h1>${escapeHtml(target.title)}</h1>
      <p>${escapeHtml(target.nodeId)} · generated from wiki flow Mermaid source and screen screenshots</p>
    </div>
    <div class="roots">
      ${rootIds.map((rootId) => renderTreeNode(rootId, graph)).join("")}
    </div>
  </div>
</body>
</html>`;
}

const targets = collectFlowTreeTargets(loadWiki(wikiRoot), repoRoot);
if (!targets.length) {
  console.log("No flow tree targets declared.");
  process.exit(0);
}

const browser = await chromium.launch();

try {
  const page = await browser.newPage({ viewport });
  for (const target of targets) {
    const fullPath = path.resolve(repoRoot, target.path);
    if (!fullPath.startsWith(`${repoRoot}${path.sep}`)) throw new Error(`Flow tree path escapes repo root: ${target.path}`);

    await page.setContent(renderFlowTreePage(target), { waitUntil: "load" });
    await page.evaluate(async () => {
      await Promise.all(
        Array.from(document.images).map((image) => {
          if (image.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", reject, { once: true });
          });
        })
      );
    });

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    await page.locator(".flow-board").screenshot({ path: fullPath });
    console.log(`captured flow tree ${target.nodeId}: ${target.path}`);
  }
} finally {
  await browser.close();
}
