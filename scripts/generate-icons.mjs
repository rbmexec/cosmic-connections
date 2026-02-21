#!/usr/bin/env node
/**
 * Generates all required iOS and Android app icons from the SVG sources.
 *
 * Usage: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { readFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..");
const ICON_SVG = readFileSync(resolve(ROOT, "public/icons/icon-512.svg"));
const MASKABLE_SVG = readFileSync(resolve(ROOT, "public/icons/icon-maskable-512.svg"));

// ── iOS ─────────────────────────────────────────────────────────────────────
// Single 1024x1024 PNG required for the App Store / Xcode asset catalog.
async function generateIOS() {
  const outDir = resolve(ROOT, "ios/App/App/Assets.xcassets/AppIcon.appiconset");
  mkdirSync(outDir, { recursive: true });

  await sharp(ICON_SVG, { density: 300 })
    .resize(1024, 1024)
    .png()
    .toFile(resolve(outDir, "AppIcon-512@2x.png"));

  console.log("  iOS  AppIcon-512@2x.png (1024x1024)");
}

// ── Android ─────────────────────────────────────────────────────────────────
// Standard launcher icons (ic_launcher.png) — square with content
// Round launcher icons (ic_launcher_round.png) — circular crop
// Adaptive foreground (ic_launcher_foreground.png) — 108dp with safe zone
const ANDROID_DENSITIES = [
  { name: "mipmap-mdpi",    launcherSize: 48,  foregroundSize: 108 },
  { name: "mipmap-hdpi",    launcherSize: 72,  foregroundSize: 162 },
  { name: "mipmap-xhdpi",   launcherSize: 96,  foregroundSize: 216 },
  { name: "mipmap-xxhdpi",  launcherSize: 144, foregroundSize: 324 },
  { name: "mipmap-xxxhdpi", launcherSize: 192, foregroundSize: 432 },
];

async function generateAndroid() {
  const resDir = resolve(ROOT, "android/app/src/main/res");

  for (const { name, launcherSize, foregroundSize } of ANDROID_DENSITIES) {
    const outDir = resolve(resDir, name);
    mkdirSync(outDir, { recursive: true });

    // ic_launcher.png — standard square icon
    await sharp(ICON_SVG, { density: 300 })
      .resize(launcherSize, launcherSize)
      .png()
      .toFile(resolve(outDir, "ic_launcher.png"));

    // ic_launcher_round.png — circular crop
    const roundMask = Buffer.from(
      `<svg width="${launcherSize}" height="${launcherSize}">` +
      `<circle cx="${launcherSize / 2}" cy="${launcherSize / 2}" r="${launcherSize / 2}" fill="white"/>` +
      `</svg>`
    );
    await sharp(ICON_SVG, { density: 300 })
      .resize(launcherSize, launcherSize)
      .composite([{ input: roundMask, blend: "dest-in" }])
      .png()
      .toFile(resolve(outDir, "ic_launcher_round.png"));

    // ic_launcher_foreground.png — adaptive icon foreground (108dp canvas)
    // The maskable SVG is designed with safe-zone padding already.
    await sharp(MASKABLE_SVG, { density: 300 })
      .resize(foregroundSize, foregroundSize)
      .png()
      .toFile(resolve(outDir, "ic_launcher_foreground.png"));

    console.log(`  Android  ${name}  launcher=${launcherSize}  foreground=${foregroundSize}`);
  }
}

// ── Run ─────────────────────────────────────────────────────────────────────
console.log("Generating app icons...\n");
await generateIOS();
await generateAndroid();
console.log("\nDone!");
