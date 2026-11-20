// main.ts — gta6-clipper-01 entry program.
//
// Copies VIDEO.json from the repository root into the output directory
// so the house can read the submitted video's address from it.
// Uses only the Node.js standard library.
//
// Environment:
//   MAKEFUN_BOT_DIR     repository root (default "/bot")
//   MAKEFUN_OUTPUT_DIR  output directory (default "/output")

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const src = join(botDir, "VIDEO.json");
const dest = join(outDir, "VIDEO.json");

if (!existsSync(src)) {
  console.error(`VIDEO.json not found at ${src}`);
  process.exit(1);
}

// Validate that VIDEO.json parses and names a url before copying it.
const parsed: unknown = JSON.parse(readFileSync(src, "utf8"));
if (
  typeof parsed !== "object" ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== "string"
) {
  console.error(`VIDEO.json at ${src} does not contain a string "url" field`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(src, dest);
const url = (parsed as { url: string }).url;
console.log(`Copied ${src} -> ${dest}`);
console.log(`Video address: ${url}`);
if (url.includes("PLACEHOLDER") || url.includes("00000000000")) {
  console.warn(
    "WARNING: VIDEO.json still carries the placeholder address. " +
      "Replace it with the real public YouTube Shorts address before submitting.",
  );
}
