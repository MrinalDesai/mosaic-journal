import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import multer from "multer";
import { getApps, initializeApp } from "firebase-admin/app";
import momentsRouter from "./routes/moments.js";

if (!getApps().length) {
  initializeApp({ storageBucket: process.env.FIREBASE_STORAGE_BUCKET });
}

const app = express();
app.set("trust proxy", 1);
const port = Number(process.env.PORT ?? 8080);

app.disable("x-powered-by");
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://apis.google.com", "https://accounts.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "blob:", "data:"],
      connectSrc: [
        "'self'",
        "https://*.googleapis.com",
        "https://*.firebaseio.com",
        "https://*.firebasestorage.app",
        "https://*.appspot.com",
        "https://securetoken.googleapis.com",
        "https://identitytoolkit.googleapis.com"
      ],
      frameSrc: ["https://accounts.google.com", "https://*.firebaseapp.com"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  }
}));
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: false, limit: "64kb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/api/public-config", (_req, res) => {
  const keys = ["FIREBASE_API_KEY", "FIREBASE_AUTH_DOMAIN", "FIREBASE_PROJECT_ID", "FIREBASE_STORAGE_BUCKET", "FIREBASE_APP_ID"] as const;
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length) return res.status(503).json({ error: "Firebase client configuration is incomplete." });
  return res.json({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    appId: process.env.FIREBASE_APP_ID
  });
});

app.use("/api", momentsRouter);

app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") return res.status(413).json({ error: "Image is larger than the allowed upload limit." });
    return res.status(400).json({ error: "Invalid image upload." });
  }
  next(error);
});

if (process.env.NODE_ENV === "production") {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const clientDir = path.resolve(__dirname, "../dist");
  app.use(express.static(clientDir, { index: false, maxAge: "1h" }));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api/")) {
      return res.sendFile(path.join(clientDir, "index.html"));
    }
    next();
  });
}

app.use((_req, res) => res.status(404).json({ error: "Not found." }));
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("unhandled request error", error instanceof Error ? error.message : "unknown");
  return res.status(500).json({ error: "Unexpected server error." });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Mosaic listening on ${port}`);
});
