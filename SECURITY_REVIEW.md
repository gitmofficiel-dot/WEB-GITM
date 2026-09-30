# Security review — 2026-09-20

Scope: local source and configuration review. No deployed-service penetration tests, database writes, or production configuration changes were performed. Deployment parity is unverified.

## Findings

1. **Critical — self-assigned administrator privileges.** `firestore.rules:30-31` permits owners to create/update their entire user document. Authorization reads `users/{uid}.role`. A registered user can therefore assign `president` or `admin` and gain the permissions granted to those roles. Require a fixed initial role and an explicit allowlist of owner-editable fields; reserve role changes for trusted administrators. Test denied self-promotion and allowed profile edits in the Firestore emulator.

2. **High — service credential exposed by frontend architecture.** `src/config/openrouter.js:7-8`, `src/services/aiService.js`, and `SmartArticleEditor.jsx` send a VITE-prefixed OpenRouter credential directly from the browser. The local environment has this variable configured; its validity and deployment were not tested. Move requests to an authenticated backend with request limits and keep the credential server-side. Rotate any key shipped to users. Judge0 uses the same frontend pattern if its optional key is configured.

3. **High — public user records and grades.** `firestore.rules:28` and `:57` permit unauthenticated reads of all user and grade documents. User records contain email addresses. Separate public profile data from private account fields and authorize grade access by student/course assignment. Firestore document reads must not be treated as field-level filtering.

4. **High — teachers have unrestricted course/grade writes.** `firestore.rules:54,58` allows every teacher to write or delete every document in these collections without ownership/course-assignment checks. Bind writes to an assigned teacher, protect assignment fields, and validate changed fields.

5. **Medium — demo identity trusted by the UI.** `src/context/AuthContext.jsx` restores `gitm_user` from localStorage when Firebase has no authenticated user. Its role selects privileged dashboards. This bypasses UI identity checks but does not itself authenticate requests to Firestore. Remove this fallback in production or isolate demo mode from live services.

6. **Conditional — HTML injection in crawler rendering.** `public/_worker.js:101-109` interpolates database values into raw HTML attributes without escaping. Exploitation depends on this worker being deployed and the legacy `gitm_data` document being readable and containing attacker-controlled fields. Current local rules deny that collection. Use attribute setters or context-appropriate escaping and test hostile field values locally.

## Configuration items requiring verification

- A Cloudinary secret exists locally under a `VITE_`-prefixed name. No source reference to that secret was found in the searched application files; this is not proof it was shipped. Remove secrets from the frontend environment namespace and check prior build artifacts before deciding whether rotation is required.
- Cloudinary uploads are unsigned. Review provider-side preset restrictions, allowed formats, file-size limits, and abuse controls; local code cannot establish the account's effective restrictions.
- Firebase Hosting configuration contains no explicit security headers. Effective deployed headers were not inspected.
- `.env` is ignored, is not currently tracked, and the local `git log --all -- .env` check returned no history. This does not cover other filenames or remote history.
- Rich text rendering uses DOMPurify in the inspected main rendering paths, a useful existing control.
- Firebase web configuration identifiers are not equivalent to private service-account credentials. The primary demonstrated Firebase issue is authorization rules.

## Dependency audit

`npm audit --omit=dev --json` completed with exit code 1 and reported six affected package entries: two high (react-router and react-router-dom), two moderate (fflate and protobufjs), and two low (quill and react-quill-new). These include dependent-package duplicates, not six independent proven exploit paths. The router advisory concerns RSC mode; this inspected application uses BrowserRouter and no RSC server was identified, so applicability is not established. The remaining advisories also require reachable affected operations. No automatic dependency fixes were applied; the proposed Quill fix changes the wrapper version and needs compatibility review.

Advisories returned by npm:
- https://github.com/advisories/GHSA-qwww-vcr4-c8h2
- https://github.com/advisories/GHSA-px8p-9vwx-vf98
- https://github.com/advisories/GHSA-j3f2-48v5-ccww
- https://github.com/advisories/GHSA-v3m3-f69x-jf25

## Remediation order

First close role escalation and excessive database access. Then move service credentials behind authenticated server endpoints. Verify the changes with emulator authorization tests before deployment. No security fixes have been applied as part of this review.

## Passive deployment check — https://gitm.pages.dev/

On 2026-09-20, ordinary HTTP GET/HEAD requests inspected the public homepage and its referenced `/assets/index-DMj2nUOv.js` bundle. No credentials were exercised and no database reads/writes or exploit attempts were performed.

- **Confirmed exposed credential:** the public entry bundle contains the exact configured local OpenRouter key. Only the boolean comparison result was output; the value is intentionally omitted. Key validity, account permissions, and evidence of prior misuse were not tested. Revoke/rotate the exposed key and move AI calls server-side before shipping a replacement. Previously downloaded bundles cannot be recalled.
- The configured local Cloudinary secret was not found in this one entry bundle. Other bundles and previous deployments were not exhaustively searched.
- HTTPS homepage returned 200. HTTP returned 301 to HTTPS.
- Observed protection headers: `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`.
- The inspected homepage response did not include `Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security`, or `Permissions-Policy`. The absence of an HSTS response header alone does not establish an HTTP downgrade vulnerability; inherited/preloaded policies were not assessed.
- `Access-Control-Allow-Origin: *` was present on the public HTML response; this is not by itself proof of private data exposure.
- The published entry bundle contains the demo-storage identifier `gitm_user`; runtime bypass behavior was not exercised.
- Firestore deployment rules remain unverified. Local rule findings must not be described as demonstrated live database compromise.
