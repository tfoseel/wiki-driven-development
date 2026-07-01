import { describe, expect, it } from "vitest";
import {
  canTransitionLegacyStatus,
  createLegacyMapFromFiles,
  legacyStatuses,
  markLegacyFileStatus,
  validateLegacyMap,
  type LegacyMap
} from "../src/legacy.js";

describe("legacy migration map", () => {
  it("creates a file-level code-SSOT map without WDD-owned surfaces", () => {
    const map = createLegacyMapFromFiles([
      "pages/index.tsx",
      "components/home.tsx",
      "wiki/홈.md",
      "harness/AGENTS.md",
      "AGENTS.md",
      "legacy-map.json",
      ".github/ISSUE_TEMPLATE/wdd-change.md",
      ".github/workflows/deploy.yml"
    ]);

    expect(map.files.map((file) => file.path)).toEqual([".github/workflows/deploy.yml", "components/home.tsx", "pages/index.tsx"]);
    expect(map.files.every((file) => file.status === "code-ssot")).toBe(true);
    expect(map.files.every((file) => Array.isArray(file.coveredBy) && Array.isArray(file.gaps) && Array.isArray(file.evidence))).toBe(true);
  });

  it("allows only the blind-migration promotion sequence into wiki-SSOT", () => {
    expect(canTransitionLegacyStatus("code-ssot", "observed")).toBe(true);
    expect(canTransitionLegacyStatus("observed", "specified")).toBe(true);
    expect(canTransitionLegacyStatus("specified", "spec-frozen")).toBe(true);
    expect(canTransitionLegacyStatus("spec-frozen", "blind-implemented")).toBe(true);
    expect(canTransitionLegacyStatus("blind-implemented", "parity-reviewed")).toBe(true);
    expect(canTransitionLegacyStatus("parity-reviewed", "wiki-ssot")).toBe(true);

    expect(canTransitionLegacyStatus("code-ssot", "wiki-ssot")).toBe(false);
    expect(canTransitionLegacyStatus("specified", "wiki-ssot")).toBe(false);
    expect(canTransitionLegacyStatus("blind-implemented", "wiki-ssot")).toBe(false);
  });

  it("validates known statuses and rejects wiki or harness files in the legacy file list", () => {
    const map: LegacyMap = {
      version: 1,
      purpose: "test",
      statuses: Object.fromEntries(legacyStatuses.map((status) => [status, status])),
      files: [
        { path: "pages/index.tsx", status: "wiki-ssot", coveredBy: ["screens/home"], gaps: [], evidence: ["wiki/화면/home/스크린샷.png"] },
        { path: "wiki/화면/home.md", status: "code-ssot", coveredBy: [], gaps: [], evidence: [] },
        { path: "harness/AGENTS.md", status: "code-ssot", coveredBy: [], gaps: [], evidence: [] },
        { path: "AGENTS.md", status: "code-ssot", coveredBy: [], gaps: [], evidence: [] },
        { path: "legacy-map.json", status: "code-ssot", coveredBy: [], gaps: [], evidence: [] },
        { path: "pages/bad.tsx", status: "done", coveredBy: [], gaps: [], evidence: [] }
      ]
    };

    expect(validateLegacyMap(map)).toEqual([
      "wiki/화면/home.md must not be listed as a legacy file; wiki/ is the SSOT surface.",
      "harness/AGENTS.md must not be listed as a legacy file; harness/ is WDD system surface.",
      "AGENTS.md must not be listed as a legacy file; it is WDD system surface.",
      "legacy-map.json must not be listed as a legacy file; it is WDD system surface.",
      "pages/bad.tsx has unknown legacy status: done"
    ]);
  });

  it("rejects premature legacy promotion without evidence, coverage, and gap closure", () => {
    const map: LegacyMap = {
      version: 1,
      purpose: "test",
      statuses: Object.fromEntries(legacyStatuses.map((status) => [status, status])),
      files: [
        { path: "pages/observed.tsx", status: "observed", coveredBy: [], gaps: [], evidence: [] },
        { path: "pages/specified-without-node.tsx", status: "specified", coveredBy: [], gaps: [], evidence: ["wiki/화면/home/스크린샷.png"] },
        {
          path: "pages/specified-with-gap.tsx",
          status: "specified",
          coveredBy: ["screens/home"],
          gaps: ["Mixpanel payload unknown"],
          evidence: ["wiki/화면/home/스크린샷.png"]
        }
      ]
    };

    expect(validateLegacyMap(map)).toEqual([
      "pages/observed.tsx must include evidence before observed.",
      "pages/specified-without-node.tsx must name coveredBy wiki nodes before specified.",
      "pages/specified-with-gap.tsx cannot be specified while unresolved gaps remain."
    ]);
  });

  it("marks legacy files through valid transitions while accumulating evidence and coverage", () => {
    const map = createLegacyMapFromFiles(["pages/home.tsx"]);
    const observed = markLegacyFileStatus(map, "pages/home.tsx", {
      status: "observed",
      evidence: ["wiki/화면/home/스크린샷.png"],
      gaps: ["Mixpanel payload unknown"]
    });

    expect(observed.files[0]).toEqual({
      path: "pages/home.tsx",
      status: "observed",
      coveredBy: [],
      gaps: ["Mixpanel payload unknown"],
      evidence: ["wiki/화면/home/스크린샷.png"]
    });

    expect(() =>
      markLegacyFileStatus(observed, "pages/home.tsx", {
        status: "wiki-ssot",
        coveredBy: ["screens/home"]
      })
    ).toThrow(/Cannot move pages\/home\.tsx from observed to wiki-ssot/);

    const specified = markLegacyFileStatus(observed, "pages/home.tsx", {
      status: "specified",
      coveredBy: ["screens/home"],
      gaps: []
    });

    expect(specified.files[0]).toMatchObject({
      status: "specified",
      coveredBy: ["screens/home"],
      evidence: ["wiki/화면/home/스크린샷.png"]
    });
  });
});
