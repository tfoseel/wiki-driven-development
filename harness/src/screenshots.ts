import type { WikiIndex } from "./index-wiki.js";
import type { WikiScreenshot } from "./node.js";

export interface WikiScreenshotTarget extends WikiScreenshot {
  nodeId: string;
  route: string;
}

export function collectScreenshotTargets(index: WikiIndex): WikiScreenshotTarget[] {
  return index.nodes.flatMap((node) => {
    if (node.type !== "screen") return [];
    return node.screenshots.flatMap((screenshot) => {
      if (!screenshot.route) return [];
      return [
        {
          ...screenshot,
          nodeId: node.id,
          route: screenshot.route
        }
      ];
    });
  });
}
