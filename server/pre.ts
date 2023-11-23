import { readdirSync, lstatSync } from "node:fs";
import path from "node:path";
import { parseFile, updateManifest } from "./helpers";

const rootDir = process.cwd();
const appDir = path.join(rootDir, "app");

const controllersPath = path.join(appDir, "http", "controllers");

async function main(p: string): Promise<string[]> {
  let files = [];
  const _p = path.join(controllersPath, p);
  const dir = readdirSync(_p);

  for (const file of dir) {
    const stat = lstatSync(path.join(controllersPath, file));
    if (stat.isFile()) {
      files.push(path.join(_p, file));
    }
    if (stat.isDirectory()) {
      files.push(...(await main(file)));
    }
  }
  return files;
}

main("").then(async (files) => {
  let obj: Record<string, string> = {};
  for (const file of files) {
    obj = { ...obj, ...(await parseFile(file)) };
  }

  updateManifest(obj);
});
