Mosaic — synthetic demo archive
===============================

111 memories across 2024, 2025 and 2026. Entirely synthetic: no real
autobiographical facts about the account owner. Six narrative arcs run through
the three years (learning, a personal project, travel, a missed opportunity, a
friendship that fades and returns, and confidence), so longitudinal views have
something real to show.

Distribution is deliberate, not random:
  routine 45%  notable 30%  important 17%  milestone 8%
  valence -0.60 to +0.88, 14 of 15 sentiment labels used
  16 places across Pune, Mumbai, Goa, Bengaluru, Delhi, Hyderabad
  21 artifact-backed memories (handwritten notes, receipts, tickets)

Coordinates are public city/area level with a small deterministic jitter, so
the 500 m venue tier finds repeat visits rather than one perfect point.

SETUP (Cloud Shell)
  cd ~/mosaic/seed
  npm install firebase-admin
  export GOOGLE_CLOUD_PROJECT=mosaic-journal-2026-97e33
  export FIREBASE_STORAGE_BUCKET=mosaic-journal-2026-97e33.firebasestorage.app

USE
  node seed.mjs --uid=<UID> --dry-run              writes nothing
  node seed.mjs --uid=<UID> --seed                 seeds once, refuses to duplicate
  node seed.mjs --uid=<UID> --cleanup-demo-data    removes only demoSeedVersion docs

Fails closed without --uid. No HTTP endpoint. Firestore and Storage rules are
not weakened for seeding; the Admin SDK runs as the operator.

Cloud Shell already provides Application Default Credentials — do not run
`gcloud auth application-default login`.
