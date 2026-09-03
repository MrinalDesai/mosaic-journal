import { fileTypeFromBuffer } from "file-type";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function validateImage(buffer: Buffer): Promise<{ mimeType: string; extension: string }> {
  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !ALLOWED.has(detected.mime)) {
    throw new Error("UNSUPPORTED_IMAGE_TYPE");
  }
  return { mimeType: detected.mime, extension: detected.ext };
}
