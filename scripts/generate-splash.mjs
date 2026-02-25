#!/usr/bin/env node
/**
 * Generates branded splash screens for iOS and Android from the SVG icon.
 * Black background with centered astr sparkle icon.
 *
 * Usage: node scripts/generate-splash.mjs
 */
import sharp from "sharp";
import { readFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..");
const ICON_SVG = readFileSync(resolve(ROOT, "public/icons/icon-512.svg"));

// Icon is rendered at ~20% of the shortest dimension, centered on black.
async function createSplash(width, height, outputPath) {
  const iconSize = Math.round(Math.min(width, height) * 0.2);
  const icon = await sharp(ICON_SVG, { density: 300 })
    .resize(iconSize, iconSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([
      {
        input: icon,
        gravity: "centre",
      },
    ])
    .png()
    .toFile(outputPath);
}

// ── iOS ───────────────────────────────────────────────────────────────────────
// Universal splash at 2732x2732 in three scales for the imageset.
async function generateIOS() {
  const outDir = resolve(ROOT, "ios/App/App/Assets.xcassets/Splash.imageset");
  mkdirSync(outDir, { recursive: true });

  const scales = [
    { name: "splash-2732x2732@1x.png", size: 2732 },
    { name: "splash-2732x2732@2x.png", size: 2732 },
    { name: "splash-2732x2732@3x.png", size: 2732 },
  ];

  for (const { name, size } of scales) {
    await createSplash(size, size, resolve(outDir, name));
    console.log(`  iOS  ${name} (${size}x${size})`);
  }

  // Write Contents.json for the imageset
  const contents = {
    images: [
      { filename: "splash-2732x2732@1x.png", idiom: "universal", scale: "1x" },
      { filename: "splash-2732x2732@2x.png", idiom: "universal", scale: "2x" },
      { filename: "splash-2732x2732@3x.png", idiom: "universal", scale: "3x" },
    ],
    info: { author: "xcode", version: 1 },
  };
  const { writeFileSync } = await import("fs");
  writeFileSync(
    resolve(outDir, "Contents.json"),
    JSON.stringify(contents, null, 2)
  );
  console.log("  iOS  Contents.json");
}

// ── Android ───────────────────────────────────────────────────────────────────
// Portrait and landscape splash at each density.
const ANDROID_DENSITIES = [
  { name: "mdpi", portrait: [320, 480], landscape: [480, 320] },
  { name: "hdpi", portrait: [480, 800], landscape: [800, 480] },
  { name: "xhdpi", portrait: [720, 1280], landscape: [1280, 720] },
  { name: "xxhdpi", portrait: [960, 1600], landscape: [1600, 960] },
  { name: "xxxhdpi", portrait: [1280, 1920], landscape: [1920, 1280] },
];

async function generateAndroid() {
  const resDir = resolve(ROOT, "android/app/src/main/res");

  // Base drawable splash
  const baseDir = resolve(resDir, "drawable");
  mkdirSync(baseDir, { recursive: true });
  await createSplash(480, 800, resolve(baseDir, "splash.png"));
  console.log("  Android  drawable/splash.png");

  for (const { name, portrait, landscape } of ANDROID_DENSITIES) {
    // Portrait
    const portDir = resolve(resDir, `drawable-port-${name}`);
    mkdirSync(portDir, { recursive: true });
    await createSplash(portrait[0], portrait[1], resolve(portDir, "splash.png"));
    console.log(`  Android  drawable-port-${name}  ${portrait[0]}x${portrait[1]}`);

    // Landscape
    const landDir = resolve(resDir, `drawable-land-${name}`);
    mkdirSync(landDir, { recursive: true });
    await createSplash(landscape[0], landscape[1], resolve(landDir, "splash.png"));
    console.log(`  Android  drawable-land-${name}  ${landscape[0]}x${landscape[1]}`);
  }
}

// ── Run ───────────────────────────────────────────────────────────────────────
console.log("Generating splash screens...\n");
await generateIOS();
await generateAndroid();
console.log("\nDone!");
