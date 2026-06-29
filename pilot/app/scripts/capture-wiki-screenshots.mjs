import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import { collectScreenshotTargets, loadWiki } from "@wdd/harness";

const appRoot = process.cwd();
const repoRoot = path.resolve(appRoot, "../..");
const wikiRoot = path.resolve(appRoot, "../wiki");
const baseUrl = process.env.WDD_BASE_URL ?? "http://127.0.0.1:3001";
const viewport = { width: 1280, height: 900 };

async function canReach(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer(url, timeoutMs) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await canReach(url)) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

let server;
if (!(await canReach(baseUrl))) {
  server = spawn("npm", ["run", "dev"], {
    cwd: appRoot,
    env: process.env,
    stdio: "inherit"
  });
  await waitForServer(baseUrl, 120_000);
}

const targets = collectScreenshotTargets(loadWiki(wikiRoot));
if (!targets.length) {
  console.log("No wiki screenshot targets declared.");
  server?.kill("SIGTERM");
  process.exit(0);
}

const browser = await chromium.launch();

try {
  const page = await browser.newPage({ viewport });
  for (const target of targets) {
    const url = new URL(target.route, baseUrl).toString();
    const fullPath = path.resolve(repoRoot, target.path);
    if (!fullPath.startsWith(`${repoRoot}${path.sep}`)) throw new Error(`Screenshot path escapes repo root: ${target.path}`);

    await page.goto(url, { waitUntil: "networkidle" });
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    await page.screenshot({ path: fullPath });
    console.log(`captured ${target.nodeId}: ${target.route} -> ${target.path}`);
  }
} finally {
  await browser.close();
  server?.kill("SIGTERM");
}
