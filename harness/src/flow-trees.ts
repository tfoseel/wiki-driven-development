import path from "node:path";
import type { WikiIndex } from "./index-wiki.js";

export interface FlowTreeScreen {
  nodeId: string;
  title: string;
  screenshotPath: string;
  alt?: string;
}

export interface FlowTreeTarget {
  nodeId: string;
  title: string;
  path: string;
  source: string;
  screens: FlowTreeScreen[];
}

function normalizePath(value: string): string {
  return value.replaceAll(path.sep, "/").replaceAll("\\", "/");
}

function resolveMarkdownTargetPath(nodeFilePath: string, repoRoot: string, markdownPath: string): string {
  if (path.isAbsolute(markdownPath)) return normalizePath(path.relative(repoRoot, markdownPath));

  const absoluteNodePath = path.isAbsolute(nodeFilePath) ? nodeFilePath : path.resolve(repoRoot, nodeFilePath);
  const absoluteTargetPath = path.resolve(path.dirname(absoluteNodePath), markdownPath);
  return normalizePath(path.relative(repoRoot, absoluteTargetPath));
}

function sectionAfterHeading(body: string, heading: string): string | undefined {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) return undefined;

  const end = lines.findIndex((line, index) => index > start && /^##\s+/.test(line));
  return lines.slice(start + 1, end === -1 ? undefined : end).join("\n").trim();
}

function withoutFencedCodeBlocks(markdown: string): string {
  return markdown.replace(/```[\s\S]*?```/g, "");
}

function firstMarkdownImagePath(markdown: string): string | undefined {
  const match = withoutFencedCodeBlocks(markdown).match(/!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
  return match?.[1];
}

function firstMermaidSource(markdown: string): string | undefined {
  const match = markdown.match(/```mermaid\s*\n([\s\S]*?)```/);
  return match?.[1]?.trim();
}

export function collectFlowTreeTargets(index: WikiIndex, repoRoot: string): FlowTreeTarget[] {
  return index.nodes.flatMap((node) => {
    if (node.type !== "flow") return [];

    const section = sectionAfterHeading(node.body, "화면 트리") ?? sectionAfterHeading(node.body, "Screen Tree");
    if (!section) return [];

    const imagePath = firstMarkdownImagePath(section);
    const source = firstMermaidSource(section);
    if (!imagePath || !source) return [];

    const screens = node.dependsOn.flatMap((dependencyId) => {
      const dependency = index.byId.get(dependencyId);
      if (dependency?.type !== "screen") return [];

      const screenshot = dependency.screenshots[0];
      if (!screenshot) return [];

      return [
        {
          nodeId: dependency.id,
          title: dependency.title,
          screenshotPath: screenshot.path,
          alt: screenshot.alt
        }
      ];
    });

    return [
      {
        nodeId: node.id,
        title: node.title,
        path: resolveMarkdownTargetPath(node.filePath, repoRoot, imagePath),
        source,
        screens
      }
    ];
  });
}
