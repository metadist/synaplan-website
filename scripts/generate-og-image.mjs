/**
 * Generate the homepage OG image (1200x630).
 * Places the Synaplan bird logo centered with AI provider logos scattered around it.
 *
 * Usage: node scripts/generate-og-image.mjs
 * Output: public/og/homepage.png
 */
import sharp from "sharp";
import { readFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const LOGOS_DIR = join(ROOT, "graphic_ideas_material", "ai-logos");
const BIRD_PATH = join(ROOT, "graphic_ideas_material", "big_bird.png");
const OUT_DIR = join(ROOT, "public", "og");
const OUT_PATH = join(OUT_DIR, "homepage.png");

const W = 1200;
const H = 630;
const BIRD_H = 280;
const LOGO_SIZE = 56;

const LOGO_FILES = [
  { file: "openai.svg", color: "#000000", label: "OpenAI" },
  { file: "anthropic.svg", color: "#181818", label: "Anthropic" },
  { file: "google.svg", color: null, label: "Gemini" },
  { file: "ollama.svg", color: "#000000", label: "Ollama" },
  { file: "groq.svg", color: "#F55036", label: "Groq" },
  { file: "mistral.svg", color: null, label: "Mistral" },
  { file: "claude.svg", color: null, label: "Claude" },
  { file: "deepseek.svg", color: null, label: "DeepSeek" },
];

// Positioned around the bird in an organic, scattered layout
// Each position is [x, y, rotation] relative to canvas center
const POSITIONS = [
  [-380, -160, -12],  // top-left area
  [-280,  100,   8],  // bottom-left area
  [-420,   20,  -5],  // far left
  [ 380, -150,  15],  // top-right area
  [ 280,  110, -10],  // bottom-right area
  [ 420,   10,   6],  // far right
  [-120, -230,   4],  // top center-left
  [ 140, -225,  -8],  // top center-right
];

function loadSvg(file, fillColor) {
  let svg = readFileSync(join(LOGOS_DIR, file), "utf8");

  // Normalize viewBox and set explicit dimensions for sharp
  svg = svg.replace(/width="[^"]*"/, `width="${LOGO_SIZE}"`);
  svg = svg.replace(/height="[^"]*"/, `height="${LOGO_SIZE}"`);

  // Replace fill="currentColor" with the actual color
  if (fillColor) {
    svg = svg.replace(/fill="currentColor"/g, `fill="${fillColor}"`);
  }

  return Buffer.from(svg);
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  // Prepare the bird logo — resize to target height, maintain aspect ratio
  const birdBuffer = await sharp(BIRD_PATH)
    .resize({ height: BIRD_H })
    .png()
    .toBuffer();

  const birdMeta = await sharp(birdBuffer).metadata();
  const birdW = birdMeta.width;

  // Center position for the bird
  const birdX = Math.round((W - birdW) / 2);
  const birdY = Math.round((H - BIRD_H) / 2) - 20; // nudge up to make room for URL text

  // Compose all layers
  const composites = [];

  // Add AI logos at scattered positions
  for (let i = 0; i < LOGO_FILES.length; i++) {
    const { file, color } = LOGO_FILES[i];
    const [dx, dy, rot] = POSITIONS[i];

    const svgBuf = loadSvg(file, color);

    // Render SVG, then rotate
    let logoBuf = await sharp(svgBuf, { density: 300 })
      .resize(LOGO_SIZE, LOGO_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    if (rot !== 0) {
      logoBuf = await sharp(logoBuf)
        .rotate(rot, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
    }

    const logoMeta = await sharp(logoBuf).metadata();
    const cx = Math.round(W / 2 + dx - logoMeta.width / 2);
    const cy = Math.round(H / 2 + dy - logoMeta.height / 2);

    composites.push({
      input: logoBuf,
      left: Math.max(0, cx),
      top: Math.max(0, cy),
    });
  }

  // Add the bird on top of the logos
  composites.push({
    input: birdBuffer,
    left: birdX,
    top: birdY,
  });

  // URL text below the bird
  const urlText = `<svg width="300" height="30" xmlns="http://www.w3.org/2000/svg">
    <text x="150" y="22" text-anchor="middle"
      font-family="system-ui, -apple-system, sans-serif"
      font-size="18" font-weight="500" fill="#64748b">
      www.synaplan.com
    </text>
  </svg>`;

  composites.push({
    input: Buffer.from(urlText),
    left: Math.round((W - 300) / 2),
    top: birdY + BIRD_H + 8,
  });

  // Create the final image
  await sharp({
    create: {
      width: W,
      height: H,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite(composites)
    .png({ quality: 90 })
    .toFile(OUT_PATH);

  console.log(`OG image generated: ${OUT_PATH} (${W}x${H})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
