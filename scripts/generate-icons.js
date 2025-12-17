import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const svgPath = path.join(root, "public", "favicon.svg");
const outDir = path.join(root, "public", "icons");

const sizes = [192, 512];

async function main() {
  await mkdir(outDir, { recursive: true });
  const svg = await readFile(svgPath);
  await Promise.all(
    sizes.map(async (size) => {
      const buffer = await sharp(svg).resize(size, size).png().toBuffer();
      const outPath = path.join(outDir, `icon-${size}.png`);
      await writeFile(outPath, buffer);
      console.log(`Generated ${outPath}`);
    })
  );
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
