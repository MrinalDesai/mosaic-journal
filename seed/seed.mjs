/**
 * Mosaic — synthetic demo archive seeder.
 *
 * Writes ~111 memories across 2024-2026 directly via the Admin SDK. No Gemini
 * calls, no cost. Every document carries demoSeedVersion so cleanup can never
 * touch memories the user made themselves.
 *
 *   node seed.mjs --uid=<UID> --dry-run
 *   node seed.mjs --uid=<UID> --seed
 *   node seed.mjs --uid=<UID> --cleanup-demo-data
 *
 * Fails closed without an explicit --uid. There is no HTTP surface for this.
 */

import { readFileSync, existsSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { MEMORIES } from "./memories.mjs";
import { resolvePlace } from "./places.mjs";

const SEED_VERSION = "demo-3yr-v1";

const args = process.argv.slice(2);
const uid = args.find((a) => a.startsWith("--uid="))?.slice(6);
const mode =
  args.includes("--cleanup-demo-data") ? "cleanup"
  : args.includes("--seed") ? "seed"
  : args.includes("--dry-run") ? "dry"
  : null;

if (!uid || !mode) {
  console.error("Usage: node seed.mjs --uid=<UID> [--dry-run|--seed|--cleanup-demo-data]");
  process.exit(1);
}

const projectId = process.env.GOOGLE_CLOUD_PROJECT;
const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
if (!projectId || !bucketName) {
  console.error("Set GOOGLE_CLOUD_PROJECT and FIREBASE_STORAGE_BUCKET.");
  process.exit(1);
}

const HERE = dirname(fileURLToPath(import.meta.url));
const IMAGES = join(HERE, "images");

initializeApp({ credential: applicationDefault(), projectId, storageBucket: bucketName });
const db = getFirestore();
const bucket = getStorage().bucket();
const col = db.collection("users").doc(uid).collection("memories");

/* ------------------------------------------------------------- dry run */

if (mode === "dry") {
  const years = {};
  let missing = 0;
  for (const m of MEMORIES) {
    const y = m.date.slice(0, 4);
    years[y] = (years[y] ?? 0) + 1;
    if (m.image && !existsSync(join(IMAGES, m.image))) {
      console.warn(`  missing artifact: ${m.image}`);
      missing += 1;
    }
  }
  console.log(`Would write ${MEMORIES.length} memories for ${uid}`);
  console.log(`  per year: ${JSON.stringify(years)}`);
  console.log(`  with artifacts: ${MEMORIES.filter((m) => m.image).length}`);
  console.log(`  missing artifact files: ${missing}`);
  console.log("  nothing written.");
  process.exit(0);
}

/* ------------------------------------------------------------- cleanup */

async function cleanup() {
  const snap = await col.where("demoSeedVersion", "==", SEED_VERSION).get();
  if (snap.empty) {
    console.log("No demo data found.");
    return;
  }
  let docs = 0;
  let objects = 0;
  for (const doc of snap.docs) {
    for (const a of doc.data().artifacts ?? []) {
      await bucket.file(a.storagePath).delete({ ignoreNotFound: true });
      objects += 1;
    }
    await doc.ref.delete();
    docs += 1;
  }
  console.log(`Removed ${docs} demo memories and ${objects} artifacts. Real memories untouched.`);
}

/* ---------------------------------------------------------------- seed */

async function seed() {
  const existing = await col.where("demoSeedVersion", "==", SEED_VERSION).limit(1).get();
  if (!existing.empty) {
    console.error(`Demo data ${SEED_VERSION} already present. Run --cleanup-demo-data first.`);
    process.exit(1);
  }

  let written = 0;
  let uploaded = 0;

  for (const m of MEMORIES) {
    const memoryId = randomUUID();
    const artifacts = [];

    if (m.image) {
      const path = join(IMAGES, m.image);
      if (!existsSync(path)) {
        console.warn(`  skipped, missing artifact: ${m.image}`);
        continue;
      }
      const artifactId = randomUUID();
      const storagePath = `users/${uid}/artifacts/${artifactId}`;
      const bytes = readFileSync(path);
      await bucket.file(storagePath).save(bytes, { contentType: "image/png", resumable: false });
      artifacts.push({
        artifactId, type: "image", storagePath,
        mimeType: "image/png", sizeBytes: bytes.length
      });
      uploaded += 1;
    }

    const when = new Date(m.date);

    await col.doc(memoryId).set({
      schemaVersion: 2,
      demoSeedVersion: SEED_VERSION,
      type: m.image ? "image" : "text",
      status: "complete",
      createdAt: Timestamp.fromDate(when),
      memoryDate: Timestamp.fromDate(when),
      sourceText: m.text ?? null,
      analysis: {
        artifactDescription: m.description,
        extractedText: m.extracted ?? m.text ?? "",
        entities: m.entities ?? [],
        inferredDate: m.date,
        tags: m.tags
      },
      sentiment: m.sentiment,
      lifeThemes: m.lifeThemes,
      eventType: m.eventType,
      significance: m.significance,
      location: m.place ? resolvePlace(m.place, memoryId) : null,
      clusterId: null,
      clarifyingQuestion: m.question,
      clarifyingAnswer: m.answer,
      narrative: m.narrative,
      artifacts
    });

    written += 1;
    if (written % 20 === 0) console.log(`  ${written} / ${MEMORIES.length}`);
  }

  console.log(`\nSeeded ${written} memories and ${uploaded} artifacts for ${uid}.`);
}

await (mode === "cleanup" ? cleanup() : seed());
process.exit(0);
