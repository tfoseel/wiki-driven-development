import path from "node:path";

export function resolveCliPath(input: string, invocationCwd = process.env.INIT_CWD, runtimeCwd = process.cwd()): string {
  if (path.isAbsolute(input)) return input;
  return path.resolve(invocationCwd || runtimeCwd, input);
}
