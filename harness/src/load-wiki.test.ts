import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadWiki } from "./load-wiki.js";

const tempDirs: string[] = [];

const writeNode = (root: string, rel: string, source: string) => {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, source);
};

describe("loadWiki", () => {
  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("loads markdown files into a wiki index", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "wdd-wiki-"));
    tempDirs.push(root);

    writeNode(
      root,
      "entities/example-entity.md",
      `---
id: entities/example-entity
type: entity
title: Example Entity
---
# Example Entity
`
    );
    writeNode(
      root,
      "models/example-model.md",
      `---
id: models/example-model
type: model
title: Example Model
depends_on: [entities/example-entity]
---
# Example Model
`
    );

    const index = loadWiki(root);

    expect(index.nodes.map((node) => node.id).sort()).toEqual(["entities/example-entity", "models/example-model"]);
    expect(index.dependents.get("entities/example-entity")).toEqual(["models/example-model"]);
  });

  it("loads wiki nodes from Korean folder and file names", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "wdd-wiki-"));
    tempDirs.push(root);

    writeNode(
      root,
      "액션/예약-생성.md",
      `---
id: actions/create-booking
type: action
title: 예약 생성
---
# 예약 생성
`
    );

    const index = loadWiki(root);

    expect(index.nodes).toHaveLength(1);
    expect(index.nodes[0]).toMatchObject({
      id: "actions/create-booking",
      filePath: path.join(root, "액션/예약-생성.md")
    });
  });
});
