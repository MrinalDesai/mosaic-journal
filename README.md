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
