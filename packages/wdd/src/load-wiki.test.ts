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
      "entities/bookings.md",
      `---
id: entities/bookings
type: entity
title: Bookings
---
# Bookings
`
    );
    writeNode(
      root,
      "models/booking.md",
      `---
id: models/booking
type: model
title: Booking
depends_on: [entities/bookings]
---
# Booking
`
    );

    const index = loadWiki(root);

    expect(index.nodes.map((node) => node.id).sort()).toEqual(["entities/bookings", "models/booking"]);
    expect(index.dependents.get("entities/bookings")).toEqual(["models/booking"]);
  });
});
