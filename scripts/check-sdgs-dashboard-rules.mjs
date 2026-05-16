#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const projectRoot = resolve(__filename, "..", "..");
const componentsDir = join(projectRoot, "components", "sdgs-dashboard");
const contentFormFile = join(
  componentsDir,
  "content-form",
  "content-form.tsx",
);

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      yield* walk(path);
      continue;
    }
    if (entry.isFile()) {
      const ext = path.slice(path.lastIndexOf("."));
      if (SOURCE_EXTENSIONS.has(ext)) {
        yield path;
      }
    }
  }
}

const violations = [];

const recordViolation = (file, message) => {
  const rel = relative(projectRoot, file).split(sep).join("/");
  violations.push(`${rel}: ${message}`);
};

const FETCH_REGEX = /\bfetch\s*\(/;
const AXIOS_IMPORT_REGEX = /from\s+["']axios["']/;
const TRY_REGEX = /\btry\b/;
const HEX_IN_CLASSNAME_REGEX =
  /className\s*=\s*(?:["'`][^"'`]*#[0-9a-fA-F]{3,8}[^"'`]*["'`]|\{[^}]*#[0-9a-fA-F]{3,8}[^}]*\})/;

for await (const file of walk(componentsDir)) {
  const source = await readFile(file, "utf8");

  if (AXIOS_IMPORT_REGEX.test(source)) {
    recordViolation(file, "Imports `axios` directly. Move HTTP calls to `services/sdgs-dashboard/`.");
  }

  if (FETCH_REGEX.test(source)) {
    recordViolation(file, "Calls `fetch(`. Move HTTP calls to `services/sdgs-dashboard/`.");
  }

  if (HEX_IN_CLASSNAME_REGEX.test(source)) {
    recordViolation(file, "Hex color literal found inside `className`. Use design tokens instead.");
  }
}

try {
  const formSource = await readFile(contentFormFile, "utf8");
  if (TRY_REGEX.test(formSource)) {
    recordViolation(
      contentFormFile,
      "`try` keyword found in content-form.tsx. Submit handler must not use try/catch.",
    );
  }
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

if (violations.length > 0) {
  console.error("SDGs Dashboard rule violations:");
  for (const message of violations) {
    console.error(`  - ${message}`);
  }
  process.exit(1);
}

console.log("SDGs Dashboard rule check passed.");
