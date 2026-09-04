import crypto from "node:crypto";
import { Router } from "express";
import multer from "multer";
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../auth.js";
import { analyseImage, analyseText, composeMemory } from "../gemini.js";
import { validateImage } from "../utils/fileValidation.js";
import { serializeFirestore } from "../utils/serialize.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: Number(process.env.MAX_IMAGE_BYTES ?? 10 * 1024 * 1024), files: 1 } });
/**
 * Client-supplied coordinates are DATA, never authority. Validated for range
 * only; they scope nothing and grant nothing.
 */
const LocationInputSchema = z.object({
  lat: z.number().finite().min(-90).max(90),
  lng: z.number().finite().min(-180).max(180),
  placeName: z.string().max(120).optional().default(""),
  locality: z.string().max(120).nullable().optional(),
  country: z.string().max(120).nullable().optional(),
  source: z.enum(["device", "manual"])
}).nullable().optional();

function parseLocation(body: unknown) {
  const raw = (body && typeof body === "object") ? (body as Record<string, unknown>).location : null;
  if (!raw) return null;
  const parsed = LocationInputSchema.safeParse(
    typeof raw === "string" ? JSON.parse(raw) : raw
  );
  if (!parsed.success || !parsed.data) return null;
  return {
    lat: parsed.data.lat,
    lng: parsed.data.lng,
    placeName: parsed.data.placeName,
    locality: parsed.data.locality ?? null,
    country: parsed.data.country ?? null,
    source: parsed.data.source
  };
}

const TextMomentSchema = z.object({ type: z.literal("text"), text: z.string().trim().min(1).max(4000) });
const AnswerSchema = z.object({ answer: z.string().trim().min(1).max(600) });
const IdSchema = z.string().uuid();

function memoryCollection(uid: string) {
  return getFirestore().collection("users").doc(uid).collection("memories");
}

function toMemoryDate(inferredDate: string | null) {
  if (!inferredDate) return FieldValue.serverTimestamp();
  const date = new Date(inferredDate);
  if (Number.isNaN(date.getTime())) return FieldValue.serverTimestamp();
  return Timestamp.fromDate(date);
}

router.use(requireAuth);

router.post("/moments", upload.single("artifact"), async (req: AuthenticatedRequest, res) => {
  const uid = req.auth!.uid;
  let uploadedPath: string | null = null;
  try {
    const memoryId = crypto.randomUUID();
    let type: "text" | "image";
    let analysis;
    let artifacts: Array<Record<string, unknown>> = [];

    if (req.file) {
      type = "image";
      const { mimeType } = await validateImage(req.file.buffer);
      analysis = await analyseImage(req.file.buffer, mimeType);

      const artifactId = crypto.randomUUID();
      uploadedPath = `users/${uid}/artifacts/${artifactId}`;
      const object = getStorage().bucket().file(uploadedPath);
      await object.save(req.file.buffer, {
        resumable: false,
        validation: "crc32c",
        metadata: { contentType: mimeType, cacheControl: "private,max-age=3600" }
      });
      artifacts = [{ artifactId, type: "image", storagePath: uploadedPath, mimeType, sizeBytes: req.file.size }];
    } else {
      type = "text";
      const parsed = TextMomentSchema.parse(req.body ?? {});
      analysis = await analyseText(parsed.text);
    }

    const { clarifyingQuestion, ...storedAnalysis } = analysis;
    const doc = {
      schemaVersion: 2,
      type,
      status: "awaiting_clarification",
      createdAt: FieldValue.serverTimestamp(),
      memoryDate: toMemoryDate(analysis.inferredDate),
      analysis: storedAnalysis,
      sourceText: type === "text" ? TextMomentSchema.parse(req.body ?? {}).text : null,
      clarifyingQuestion,
      clarifyingAnswer: null,
      narrative: null,
      artifacts,
      sentiment: analysis.sentiment,
      lifeThemes: analysis.lifeThemes,
      eventType: analysis.eventType,
      significance: analysis.significance,
      clusterId: null,
      demoSeedVersion: null,
      location: parseLocation(req.body)
    };

    await memoryCollection(uid).doc(memoryId).set(doc);
    return res.status(201).json({ memoryId, analysis: storedAnalysis, question: clarifyingQuestion });
  } catch (error) {
    if (uploadedPath) {
      await getStorage().bucket().file(uploadedPath).delete({ ignoreNotFound: true }).catch(() => undefined);
    }
    if (error instanceof z.ZodError) return res.status(400).json({ error: "Invalid moment payload." });
    if (error instanceof Error && error.message === "UNSUPPORTED_IMAGE_TYPE") {
      return res.status(400).json({ error: "Only genuine JPEG, PNG, and WebP images are supported in this build." });
    }
    console.error("create moment failed", { uid, error: error instanceof Error ? error.message : "unknown" });
    return res.status(500).json({ error: "Mosaic could not create this moment. Please retry." });
  }
});

router.post("/moments/:memoryId/answer", async (req: AuthenticatedRequest, res) => {
  const uid = req.auth!.uid;
  try {
    const memoryId = IdSchema.parse(req.params.memoryId);
    const { answer } = AnswerSchema.parse(req.body ?? {});
    const ref = memoryCollection(uid).doc(memoryId);
    const snapshot = await ref.get();
    if (!snapshot.exists) return res.status(404).json({ error: "Memory not found." });

    const data = snapshot.data()!;
    if (data.status !== "awaiting_clarification") {
      return res.status(409).json({ error: "This memory is not awaiting clarification." });
    }

    const narrative = await composeMemory(data.analysis, answer);
    await ref.update({
      clarifyingAnswer: answer,
      narrative,
      status: "complete",
      updatedAt: FieldValue.serverTimestamp()
    });

    const updated = await ref.get();
    return res.json({ memory: serializeFirestore({ id: updated.id, ...updated.data() }) });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: "Invalid answer payload." });
    console.error("answer moment failed", { uid, error: error instanceof Error ? error.message : "unknown" });
    return res.status(500).json({ error: "Mosaic could not compose this memory. Your answer was not cleared; please retry." });
  }
});

router.get("/memories", async (req: AuthenticatedRequest, res) => {
  const uid = req.auth!.uid;
  try {
    const snapshot = await memoryCollection(uid).orderBy("memoryDate", "desc").limit(500).get();
    const memories = snapshot.docs.map((doc) => serializeFirestore({ id: doc.id, ...doc.data() }));
    return res.json({ memories });
  } catch (error) {
    console.error("list memories failed", { uid, error: error instanceof Error ? error.message : "unknown" });
    return res.status(500).json({ error: "Could not load memories." });
  }
});

/**
 * Cluster metadata, written by the offline clustering batch job.
 * Read-only here: clustering never runs in a request path.
 */
router.get("/clusters", async (req: AuthenticatedRequest, res) => {
  const uid = req.auth!.uid;
  try {
    const snapshot = await getFirestore()
      .collection("users").doc(uid).collection("clusters")
      .orderBy("memoryCount", "desc")
      .limit(50)
      .get();
    const clusters = snapshot.docs.map((doc) => ({
      clusterId: Number(doc.id),
      ...doc.data()
    }));
    return res.json({ clusters });
  } catch (error) {
    console.error("list clusters failed", { uid, error: String(error) });
    return res.status(500).json({ error: "Could not load constellations." });
  }
});

router.delete("/memories/:memoryId", async (req: AuthenticatedRequest, res) => {
  const uid = req.auth!.uid;
  try {
    const memoryId = IdSchema.parse(req.params.memoryId);
    const ref = memoryCollection(uid).doc(memoryId);
    const snapshot = await ref.get();
    if (!snapshot.exists) return res.status(404).json({ error: "Memory not found." });

    const data = snapshot.data()!;
    const artifacts = Array.isArray(data.artifacts) ? data.artifacts : [];
    for (const artifact of artifacts) {
      const expectedPrefix = `users/${uid}/artifacts/`;
      const path = typeof artifact?.storagePath === "string" ? artifact.storagePath : "";
      if (path.startsWith(expectedPrefix)) {
        await getStorage().bucket().file(path).delete({ ignoreNotFound: true });
      }
    }
    await ref.delete();
    return res.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: "Invalid memory identifier." });
    console.error("delete memory failed", { uid, error: error instanceof Error ? error.message : "unknown" });
    return res.status(500).json({ error: "Could not delete this memory completely." });
  }
});

export default router;
