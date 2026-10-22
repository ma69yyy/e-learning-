# EduVantage — Online Learning Application

EduVantage extends the supplied React/Vite e-learning application with component and interaction tests, route/data splitting, image/video loading improvements, an installable offline-capable PWA shell, accessibility improvements, and deployment configurations for GitHub Pages, Netlify, and Vercel. Existing course, enrollment, quiz, assignment, learning-progress, and authentication flows remain in the working copy.

## Run and verify locally

```bash
npm ci
npm run dev
```

```bash
npm test                 # Jest + React Testing Library
npm run test:coverage    # Jest coverage report
npm run lint             # Oxlint
npm run build            # Vite production build in dist/
```

The 10 Jest suites (22 tests) cover course cards and details, Home/404 keyboard navigation, course search/filtering, provider-backed enrollment, learning-material completion and progress persistence, quiz results, assignments, deferred-video behavior, header links, and security helpers. Learning flows use the real `LearningProvider` and assert persisted state changes.

## Experiment 1 — Test E-Learning Components
The focused experiment is ready to run in the VS Code integrated terminal with `npm run test:experiment1`. See [EXPERIMENT_1.md](./EXPERIMENT_1.md) for the objectives, test-to-objective map, setup steps, and expected results.

## Performance, accessibility, and PWA

Page routes are loaded with React `lazy`/`Suspense`, and the course catalog data is a dynamic import separate from lightweight filter options. Course images use browser lazy loading and asynchronous decoding; optional lesson video URLs are validated and loaded only when near the viewport with `preload="none"`. Search, filters, form fields, quiz answers, progress bars, and assignment dialog controls expose accessible labels, errors, and keyboard behavior. Visible focus styling and reduced-motion handling are included.

The application owns `public/manifest.webmanifest` and `public/sw.js`. On production HTTPS (or localhost), the service worker provides an offline app-shell fallback and caches only same-origin public build assets under `/assets/` and `/icons/`. Private/no-store responses and responses varying on cookies or authorization are not cached. It skips API/auth and bearer-authenticated requests and never caches video/audio or local authentication tokens. Previously visited application code and browser-local learning progress can remain available offline; media and unvisited lazy routes still need a connection. PWA installation and service workers require a secure origin.

## Front-end authentication security boundary

New browser-local registrations store salted PBKDF2-SHA-256 password verifiers rather than plaintext passwords, and a legacy browser-local password is migrated after a successful sign-in. Input is bounded and normalized, external submission links are restricted to safe HTTP(S) URLs, return paths are constrained to same-origin app paths, and user text is rendered as text.

**This remains an educational front-end demo, not production authentication.** The JWT is a client-generated mock token, the demo password is present in the app, and localStorage can be read or modified by the user or injected script. PBKDF2 in the browser does not make localStorage an identity system. For public production use, replace the mock with a trusted identity provider/server, server-side password verification, and secure HttpOnly/SameSite cookies; never treat the demo token or local course/grade records as authoritative.

The built-in demo login remains: `alex.johnson@elearn.edu` / `Password123!`.

## Deploy

All three provider configurations are prepared in this repository. GitHub access was approved, but no Pages site has been published. Netlify and Vercel access were not approved, so those providers remain configuration-only and no account actions will be attempted there.

### GitHub Pages

1. Push this repository to GitHub and set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. GitHub recommends Actions when a site needs a custom build process.[1]
2. The workflow runs on `main`, tests, installs from `package-lock.json`, and publishes `dist/`. It uses `/` for `username.github.io` repositories and `/<repository>/` for project sites; set the repository Actions variable `VITE_BASE_PATH` to override that default, such as `/` for a custom domain.
3. The workflow copies `index.html` to `404.html` so React Router deep links can fall back to the client app. Vite's GitHub Pages guide requires the correct project-site `base` and an Actions build.[2]

The Pages deployment job remains paused until `ENABLE_GITHUB_PAGES=true` is set as a repository Actions variable and the Pages source is set to **GitHub Actions**. GitHub Free personal accounts include Pages for public repositories; a private source repository needs a plan that supports Pages for private repositories.[7] The site itself is public. Keep the repository private by default; if the account cannot publish Pages from a private source, decide explicitly whether to make the source public rather than exposing it automatically.

### Netlify

Import the repository and use the committed `netlify.toml`: `npm run build` publishes `dist/`, while the rewrite supports client-side routes and response headers set baseline protections. Netlify detects Vite builds as `npm run build` with `dist` output, and its documentation notes that history-based SPAs need a rewrite to serve `index.html` for requested routes.[3][4] Connected pull requests can receive unique Deploy Preview URLs before production publication.[5]

### Vercel

Import the repository and use the committed `vercel.json`: `npm run build` outputs `dist/`, the rewrite supports client-side routes, and headers set baseline protections. Vercel's Vite guide documents the SPA rewrite requirement for deep links and supports preview deployments for Git-connected projects.[6]

### After-deploy smoke test (run separately for each provider)

1. Open `/` and `/courses`; confirm the app loads and course cards, images, search, and category/difficulty/duration/instructor filters work.
2. Open `/course/102`, complete enrollment, then open `/learning` and `/learning/materials?courseId=102` (course 101 is pre-enrolled in the demo data).
3. Mark a lesson complete, reload the page, and confirm progress remains; submit a quiz and a sample assignment, then confirm the progress/grade views update.
4. Sign in with the demo account above or use a new browser-local account; verify protected pages, logout, and expired-session handling.
5. Refresh a deep link directly (especially on GitHub Pages), inspect the browser Application panel for the manifest/service worker, and test offline shell navigation after a successful online visit.
6. Confirm images and optional video load on demand, no console/build errors occur, and configured security headers are present where the provider supports them.

## Platform comparison

| Platform | Best fit | Strengths | Trade-offs |
| --- | --- | --- | --- |
| GitHub Pages | Static coursework/demo hosting tied to a GitHub repository | Native repository workflow; the committed Actions file builds the Vite app and publishes its static artifact; the project-site base and deep-route fallback are handled.[1][2] | Static hosting; project sites need a repository-path base, and private-source eligibility depends on the account plan.[7] |
| Netlify | Static projects that benefit from deploy previews and explicit redirect/header rules | Vite build/output settings are detected; file-based SPA rewrite and security headers are committed; pull requests get separate preview URLs.[3][4][5] | Provider-specific config; this application remains a static frontend unless a backend is added. |
| Vercel | Git-connected frontend projects that benefit from preview deploys and future serverless extensions | Vite static output and an SPA deep-link rewrite are supported; connected Git projects can use preview deployments, and Vercel documents Functions for projects that later need server-side behavior.[6] | Provider-specific config and account required; the app's current build is still static and its mock authentication is not made production-ready by hosting there. |

All three can serve this project's `dist/` static build. For a repository-centered classroom demo, GitHub Pages keeps build and deployment in GitHub Actions. Netlify is useful when its preview and redirect/header workflow is desired. Vercel offers the same static SPA path with an option to add serverless functions later. These are configuration comparisons only; live deployment and after-deploy verification still require connecting and publishing through the chosen provider account.

## References

[1]: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site "GitHub Pages Publishing Sources"
[2]: https://vite.dev/guide/static-deploy "Vite Static Site Deployment Guide"
[3]: https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/ "Vite on Netlify"
[4]: https://docs.netlify.com/manage/routing/redirects/overview/ "Netlify Redirects and Rewrites"
[5]: https://docs.netlify.com/deploy/deploy-types/deploy-previews/ "Netlify Deploy Previews"
[6]: https://vercel.com/docs/frameworks/frontend/vite "Vite on Vercel"
[7]: https://docs.github.com/get-started/learning-about-github/githubs-products "GitHub Plans and Pages Availability"
"# e-learning-" 
