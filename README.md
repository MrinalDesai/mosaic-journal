# Mosaic

**Mosaic** is a secure multimodal journal where an artifact becomes the entry. In v1, a user can type a thought or drop an image; Gemini analyses it, asks exactly one clarifying question, then creates a grounded first-person memory.

## Architecture

```text
React + Firebase Auth
        |
        | Firebase ID token
        v
Cloud Run / Express API
        |
        +-- verify token -> derive uid (never trust client uid)
        +-- validate artifact
        +-- Gemini analyse
        +-- Gemini compose
        |
        +--> Firestore: users/{uid}/memories/{memoryId}
        +--> Cloud Storage: users/{uid}/artifacts/{artifactId}
```

Binary artifacts are never stored in Firestore. Firestore contains metadata and owner-bound storage paths only. Gemini never receives a capability that can query arbitrary users.

## Threat Summary

| Threat zone | Mosaic-specific risk | Countermeasure |
|---|---|---|
| Input surfaces | Malicious/oversized upload | Server-side size limit, magic-byte MIME inspection, allowlist |
| Prompting | Journal or image says “ignore instructions” | Journal payload is CONTENT only; system instruction is separate; model has no arbitrary-user data tool |
| Authorization | Forged UID in request | API accepts no UID; derives UID from verified Firebase ID token |
| Firestore | Cross-user read/write | UID-scoped backend paths + owner-bound Firestore rules |
| Storage | Guessing another user's object | UID-scoped object paths + owner-bound Storage rules; no public object URLs in Firestore |
| Model output | Hallucinated autobiographical facts | Structured analysis; separate compose call; compose is limited to stored analysis + clarification |
| Secret leakage | Gemini key reaches browser/repo | Cloud Run Secret Manager injection; server-side environment only |
| Persistence | Object upload succeeds but doc write fails | Compensating delete of uploaded object |
| Deletion | Metadata deleted but binary remains | Delete each owner-scoped object before deleting memory document |

## Artifact trust table

| Type | Extraction path | Trust classification | Storage | Authorization point |
|---|---|---|---|---|
| Typed text | Text -> Gemini structured analysis | CONTENT | Firestore analysis/metadata; no binary | Firebase token verified before processing |
| JPEG/PNG/WebP | Server validates bytes -> Gemini image analysis | CONTENT | Cloud Storage binary + Firestore metadata | Firebase token verified before processing/upload |
| PDF (future) | PDF -> Gemini document analysis | CONTENT | Cloud Storage + Firestore | Same UID gate; not implemented in v1 |
| Audio (future) | Audio -> Gemini audio analysis/transcript | CONTENT | Cloud Storage + Firestore | Same UID gate; not implemented in v1 |
| Location (future) | Browser coordinates -> validated structured metadata | CONTENT | Firestore | Same UID gate; not implemented in v1 |

## Data model

`users/{uid}/memories/{memoryId}`

```json
{
  "schemaVersion": 1,
  "type": "image",
  "status": "awaiting_clarification | complete",
  "createdAt": "server timestamp",
  "memoryDate": "timestamp",
  "sourceText": null,
  "analysis": {
    "artifactDescription": "...",
    "extractedText": "...",
    "entities": [{ "name": "...", "type": "..." }],
    "inferredDate": null,
    "tags": ["...", "..."]
  },
  "clarifyingQuestion": "...",
  "clarifyingAnswer": null,
  "narrative": null,
  "artifacts": [{
    "artifactId": "server UUID",
    "type": "image",
    "storagePath": "users/<uid>/artifacts/<artifactId>",
    "mimeType": "image/jpeg",
    "sizeBytes": 123456
  }],
  "location": null
}
```

For `type: "text"`, `sourceText` contains the original typed journal artifact and `artifacts` is empty. For image memories, `sourceText` is null and the original binary is retained in owner-bound Cloud Storage.

`createdAt` is capture time. `analysis.inferredDate` is only populated when the artifact supports an event/memory date. `memoryDate` uses that supported inferred date, otherwise capture time.

## API

- `POST /api/moments` — JSON `{type:"text", text:"..."}` or multipart image field `artifact`
- `POST /api/moments/{memoryId}/answer` — JSON `{answer:"..."}`
- `GET /api/memories`
- `DELETE /api/memories/{memoryId}`

All protected endpoints require `Authorization: Bearer <Firebase ID token>`.

## Firebase setup

1. Create a Google Cloud / Firebase project.
2. Enable Firebase Authentication -> Google provider.
3. Create Firestore.
4. Create Cloud Storage.
5. Add a Web App in Firebase and copy its public client configuration into Cloud Run environment variables.
6. Install Firebase CLI and deploy the included rules:

```bash
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy --only firestore:rules,storage
```

The Firebase web API key/client config is public application configuration, not an authorization secret. Authorization comes from Firebase Auth tokens and Rules.

## Local development

Use Application Default Credentials for Firebase Admin locally instead of committing a service-account JSON file:

```bash
gcloud auth application-default login
cp .env.example .env
# edit .env with your project values and a local Gemini key
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
API: `http://localhost:8080`

## Secret Manager + Cloud Run

Create the Gemini secret. The deployment below pins environment-variable injection to secret version `1`; rotate deliberately rather than silently changing a running service:

```bash
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
printf '%s' 'YOUR_GEMINI_API_KEY' | gcloud secrets versions add GEMINI_API_KEY --data-file=-
```

Create a dedicated Cloud Run runtime service account (recommended):

```bash
gcloud iam service-accounts create mosaic-runtime \
  --display-name="Mosaic Cloud Run runtime"
```

Grant only the permissions Mosaic needs. Replace variables first:

```bash
PROJECT_ID="your-project-id"
RUNTIME_SA="mosaic-runtime@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/datastore.user"

BUCKET="gs://YOUR_BUCKET_NAME"
gcloud storage buckets add-iam-policy-binding "$BUCKET" \
  --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/storage.objectAdmin"

gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/secretmanager.secretAccessor"
```

Deploy from source (or build the Dockerfile) and inject the secret at runtime:

```bash
gcloud run deploy mosaic \
  --source . \
  --region=asia-south1 \
  --allow-unauthenticated \
  --service-account="$RUNTIME_SA" \
  --set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:1 \
  --set-env-vars=FIREBASE_API_KEY='YOUR_PUBLIC_WEB_API_KEY',FIREBASE_AUTH_DOMAIN='YOUR_PROJECT.firebaseapp.com',FIREBASE_PROJECT_ID='YOUR_PROJECT_ID',FIREBASE_STORAGE_BUCKET='YOUR_BUCKET',FIREBASE_APP_ID='YOUR_APP_ID',GEMINI_MODELS='gemini-3.6-flash,gemini-3.1-flash-lite,gemini-flash-latest,gemini-3.7-flash'
```

`--allow-unauthenticated` makes the web application reachable; the private APIs still enforce Firebase ID-token authentication themselves.

If the ideathon dashboard requires the campaign label, apply it exactly as specified by the challenge instructions, for example:

```bash
gcloud run services update mosaic \
  --region=asia-south1 \
  --update-labels=dev-tutorial=cloud-run-ai-challenge
```

## Security rules

Both `firestore.rules` and `storage.rules` are included and end in explicit default deny. Server-side Firebase Admin calls bypass those rules, so every server operation independently scopes paths using the UID from the verified Firebase token.

## Security test checklist

1. Unauthenticated `GET /api/memories` -> 401.
2. Invalid/expired ID token -> 401.
3. User A captures a memory; User B cannot see it through the API.
4. Attempt to send `uid` in JSON/query -> ignored because no endpoint reads it.
5. Upload a renamed non-image file -> 400 after byte inspection.
6. Upload > configured size -> rejected by Multer limit.
7. Journal text containing `ignore previous instructions` -> treated as content and analysed, not executed.
8. Image containing instruction-like text -> treated as content only.
9. Force Firestore write failure after image upload -> uploaded object is deleted.
10. Delete a memory -> associated objects and Firestore document are both removed.
11. Search built frontend/server logs -> no Gemini secret, Firebase tokens, or full journal bodies.
12. Sign in as a second account and confirm Storage SDK cannot read User A artifact path.

## V1 scope

Implemented: text, images, Google sign-in, analyse -> one question -> compose -> timeline, delete.  
Not implemented yet: PDF, audio, geolocation, search, embeddings, semantic retrieval, clustering.


## Browser thumbnail access

The UI uses the authenticated Firebase Storage SDK `getBlob()` rather than persisting public download URLs. Configure bucket CORS for your actual local and Cloud Run origins before testing thumbnails. Start from `storage.cors.example.json`, copy it to `storage.cors.json`, replace the placeholder origin, then run:

```bash
cp storage.cors.example.json storage.cors.json
# edit storage.cors.json
gcloud storage buckets update gs://YOUR_BUCKET --cors-file=storage.cors.json
```


## Firebase Auth deployment note

After Cloud Run gives you the final service URL, add that hostname under **Firebase Console -> Authentication -> Settings -> Authorized domains**. Otherwise Google Sign-In can fail on the deployed app even if it works on localhost.
## Production notes

These are decisions made while taking Mosaic from a working prototype to a
deployed service. Each one changed the architecture, so they are recorded here
rather than buried in commit messages.

### Gemini access runs through Vertex AI, not the AI Studio endpoint

Mosaic calls Gemini through Vertex AI (`aiplatform.googleapis.com`) using the
Cloud Run runtime service account and Application Default Credentials, rather
than through `generativelanguage.googleapis.com` with an API key.

The immediate reason was a billing-state bug: every call to the AI Studio
endpoint returned `429 RESOURCE_EXHAUSTED` with "your prepayment credits are
depleted", on a project that AI Studio itself reported as free tier, with zero
recorded usage. Regenerating the key did not help, and this is a widely reported
backend synchronisation issue rather than a project misconfiguration.

The better reason is that the resulting architecture is stronger. Vertex
authenticates via the service account's IAM identity, so there is no long-lived
API key in the request path at all — nothing to leak, rotate, or accidentally
commit. Authorization is a `roles/aiplatform.user` binding that can be revoked
centrally.

The `GEMINI_API_KEY` secret remains provisioned in Secret Manager and bound to
the service. It is the fallback path for local development, where ADC is not
available, and the client selects between the two at startup:

```ts
function aiClient() {
  if (process.env.GOOGLE_GENAI_USE_VERTEXAI === "true") {
    return new GoogleGenAI({
      vertexai: true,
      project: process.env.GOOGLE_CLOUD_PROJECT,
      location: process.env.GOOGLE_CLOUD_LOCATION ?? "global"
    });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
  return new GoogleGenAI({ apiKey });
}
```

`GOOGLE_CLOUD_LOCATION=global` matters: regional Vertex endpoints do not carry
every model, and `global` routes to wherever the requested model is served.

### A security header broke authentication

Google Sign-In failed in every browser with `auth/popup-closed-by-user`, after
the user had completed Google's consent screen. The popup was not closed — it
succeeded and then could not report back.

The cause was Mosaic's own hardening. Helmet sets
`Cross-Origin-Opener-Policy: same-origin` by default, which severs the
`window.opener` reference between a page and any popup it spawns. That is
correct behaviour as an anti-tab-nabbing measure, and Firebase's popup flow
depends on exactly that reference to deliver the credential home. Firebase
cannot distinguish "user closed the window" from "lost contact with the window",
so it reports both identically.

The fix narrows the policy rather than removing it:

```ts
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  contentSecurityPolicy: { /* ... */ }
}));
```

This keeps cross-origin isolation for everything Mosaic did not open itself.

The general lesson is worth stating plainly, because it is the inverse of the
failure mode this project set out to avoid: a security control applied without
understanding which trust boundary it governs will break legitimate
functionality. Mosaic shipped secure enough to lock out its own login.

### Cloud Run sits behind a proxy

`express-rate-limit` logged `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR` on every
request. Cloud Run terminates TLS and forwards, so Express must be told to trust
the proxy or the rate limiter cannot identify clients — meaning rate limiting
was silently ineffective rather than merely noisy.

```ts
app.set("trust proxy", 1);
```

### Capture state survives a page reload

A memory at `status: awaiting_clarification` holds its question on the Firestore
document, not in React state. Any pending memory can therefore be completed
later, from any session or device.

This was found by reloading the page mid-capture: the clarifying question
disappeared with the component state and the memory was unreachable, answerable
only by deletion. Because the document already carried `clarifyingQuestion`, the
fix was to render the answer affordance on the memory card itself rather than
only in the composer. No schema change, no migration.

### Environment configuration

`--set-env-vars` uses commas as its delimiter, so a variable whose *value*
contains commas — such as the model fallback ladder — is parsed as additional
variable names. Configuration is therefore supplied as a file:

```bash
gcloud run deploy mosaic \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest \
  --env-vars-file env.yaml
```

`env.yaml` is gitignored. It holds no credentials — Firebase web configuration
is public by design and is served to the client from `/api/public-config` — but
environment files do not belong in version control.

Required keys:

```yaml
FIREBASE_API_KEY: "..."
FIREBASE_AUTH_DOMAIN: "PROJECT_ID.firebaseapp.com"
FIREBASE_PROJECT_ID: "PROJECT_ID"
FIREBASE_STORAGE_BUCKET: "PROJECT_ID.firebasestorage.app"
FIREBASE_APP_ID: "..."
GOOGLE_GENAI_USE_VERTEXAI: "true"
GOOGLE_CLOUD_PROJECT: "PROJECT_ID"
GOOGLE_CLOUD_LOCATION: "global"
GEMINI_MODELS: "gemini-2.5-flash,gemini-2.0-flash,gemini-2.5-flash-lite"
```

### Two setup steps that fail silently

**Bucket CORS.** Artifacts are read client-side with the authenticated Storage
SDK (`getBlob`), never from public object URLs. Without bucket CORS the fetch
fails, the error is caught, and images simply never appear — no console error a
casual reader would notice.

```bash
gcloud storage buckets update gs://YOUR_BUCKET --cors-file=storage.cors.json
```

**Authorized domains.** The Cloud Run hostname must be added under Firebase
Authentication → Settings → Authorized domains, or Google Sign-In is rejected at
the OAuth redirect.

### Deployment prerequisites

```bash
gcloud services enable \
  run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com \
  firestore.googleapis.com storage.googleapis.com secretmanager.googleapis.com \
  aiplatform.googleapis.com

# Vertex access for the Cloud Run runtime service account
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# Secret Manager (fallback path / local development)
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "YOUR_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Security rules for both isolation boundaries
npx firebase-tools deploy --only firestore:rules,storage --project PROJECT_ID

# Challenge verification label
gcloud run services update mosaic \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=asia-south1
```

### Verified end to end

- Google Sign-In, with the ID token verified server-side on every request
- Typed text moment: analysis, clarifying question, grounded narrative
- Image moment: multimodal OCR over a hotel receipt — guest name, both dates,
  every line item, total and payment method extracted from the photograph
- `inferredDate` filing a 2024 receipt under its own check-in date rather than
  the capture date
- Owner-bound thumbnail retrieval via the authenticated Storage SDK
- Persistence across sign-out and sign-in
- Capture state surviving a mid-flow page reload
