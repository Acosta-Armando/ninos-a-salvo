/**
 * Genera PNGs para PWA desde public/icons/icon.svg
 * Uso: npm run icons:pwa
 */
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public/icons");

const sizes = [
  { name: "icon-192.png", size: 192, src: "icon.svg" },
  { name: "icon-512.png", size: 512, src: "icon.svg" },
  { name: "apple-touch-icon.png", size: 180, src: "icon.svg" },
  { name: "icon-maskable-512.png", size: 512, src: "icon-maskable.svg" },
  { name: "favicon.ico", size: 48, src: "icon.svg", ico: true },
];

async function main() {
  mkdirSync(outDir, { recursive: true });

  for (const item of sizes) {
    const { name, size, src } = item;
    const svg = readFileSync(resolve(outDir, src));
    const pipeline = sharp(svg).resize(size, size);

    if (item.ico) {
      await pipeline.toFile(resolve(root, "public", name));
    } else {
      await pipeline.png().toFile(resolve(outDir, name));
    }

    console.log(`✓ ${name} (${size}×${size})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
