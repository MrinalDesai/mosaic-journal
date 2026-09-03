import type { NextFunction, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";

export interface AuthenticatedRequest extends Request {
  auth?: { uid: string };
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const header = req.header("authorization") ?? "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required." });
    }
    const token = header.slice("Bearer ".length).trim();
    if (!token) return res.status(401).json({ error: "Authentication required." });

    const decoded = await getAuth().verifyIdToken(token, true);
    req.auth = { uid: decoded.uid };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired authentication token." });
  }
}
