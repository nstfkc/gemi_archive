import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { TypescriptParser } from "typescript-parser";

const rootDir = process.cwd();
const libDir = path.join(rootDir, "lib");

const parser = new TypescriptParser();

export async function parseFile(
  filePath: string,
): Promise<Record<string, string>> {
  const parsed = await parser.parseFile(filePath, rootDir);
  const imports = parsed.imports;
  const importPaths = {};
  const manifest: Record<string, string> = {};
  const output = {};
  for (const imp of imports) {
    if (imp.libraryName.includes("Request")) {
      importPaths[imp.defaultAlias] = imp.libraryName;
    }
  }
  for (const declaration of parsed.declarations) {
    const className = declaration.name;

    if (!declaration.methods) {
      continue;
    }
    for (const method of declaration.methods) {
      const methodName = method.name;
      const req = method.parameters[0];
      if (req) {
        manifest[`${className}.${methodName}`] =
          importPaths?.[req.type] ?? undefined;
      }
    }
  }
  return manifest;
}

export function updateManifest(update: Record<string, string>) {
  const manifestPath = path.join(libDir, "http", "methodRequestMap.json");

  const manifest = readFileSync(manifestPath).toString();

  writeFileSync(
    manifestPath,
    JSON.stringify({ ...JSON.parse(manifest), ...update }),
  );
}
