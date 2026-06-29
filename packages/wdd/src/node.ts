export type WikiNodeType =
  | "entity"
  | "model"
  | "action"
  | "page"
  | "flow"
  | "policy"
  | "qa"
  | "term"
  | "design"
  | "root";

export interface WikiNode {
  id: string;
  type: WikiNodeType;
  title: string;
  summary?: string;
  filePath: string;
  body: string;
  dependsOn: string[];
  implementedBy: string[];
  verifiedBy: string[];
  artifacts: string[];
  verifyCommands: string[];
}
