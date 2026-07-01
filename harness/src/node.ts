export type WikiNodeType =
  | "entity"
  | "model"
  | "action"
  | "screen"
  | "flow"
  | "policy"
  | "qa"
  | "term"
  | "design"
  | "root";

export type WddWorkflowPhase = "wiki" | "coding" | "verification" | "verified" | "blocked";
export type WddCodeStatus = "pending" | "reflected" | "not_required";
export type WddVerificationStatus = "pending" | "passed" | "failed" | "not_required";

export interface WddStatus {
  phase: WddWorkflowPhase;
  code: WddCodeStatus;
  verification: WddVerificationStatus;
  note?: string;
}

export interface WikiScreenshot {
  path: string;
  alt?: string;
  route?: string;
  capturedAt?: string;
}

export interface WikiAsset {
  path: string;
  purpose?: string;
  source?: string;
  license?: string;
}

export interface WikiLegacyState {
  status: string;
}

export interface WikiNode {
  id: string;
  type: WikiNodeType;
  title: string;
  summary?: string;
  metadataFormat?: "frontmatter" | "hidden-wdd";
  wddStatus: WddStatus;
  filePath: string;
  body: string;
  dependsOn: string[];
  implementedBy: string[];
  verifiedBy: string[];
  artifacts: string[];
  assets: WikiAsset[];
  screenshots: WikiScreenshot[];
  legacy?: WikiLegacyState;
  verifyCommands: string[];
}
