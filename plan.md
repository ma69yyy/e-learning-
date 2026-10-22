# EduVantage — implementation plan

## Scope and approach

Extend the supplied React 19 / Vite 8 / React Router application to satisfy the component-testing, optimization, PWA, accessibility, front-end security, and deployment-preparation requirements. Preserve the existing authentication flow, routes, course catalog, enrollment, learning modules, quiz, assignment, and visual behavior. The uploaded ZIP and its extracted source at `/home/ubuntu/projects/eduvantage` remain unchanged; implementation happens in the managed working copy `/home/ubuntu/eduvantage`.

Experiment 1 and Experiment 2 are integrated: tests exercise the existing user flows, while optimizations are added through small changes at their current integration points. Experiment 3 is delivered as a production build and ready-to-use configuration for GitHub Pages, Netlify, and Vercel, with post-deployment checks and a platform comparison. GitHub access was approved; a live public Pages release remains subject to explicit final publication confirmation and Pages plan eligibility. Netlify and Vercel access were not approved, so their configurations remain unconnected and will not be used to publish.

## Implementation decisions

- **Existing architecture:** retain the React Router route tree, `AuthProvider`, `LearningProvider`, existing page/component hierarchy, course data model, and current local progress persistence. Add functionality through an imported copy of the supplied source rather than replacing it with a new scaffold.
- **Testing:** use Jest with Babel transformation for the ESM/JSX Vite code, React Testing Library, `user-event`, `jest-dom`, and a jsdom environment. Exercise search/filter, course detail navigation, enrollment, lesson progress, quiz results, and assignments with the real `LearningProvider`; mock only the auth identity and browser observer boundaries. Do not mutate external or production data.
- **Performance:** apply `React.lazy`/`Suspense` at route and learning-feature boundaries, dynamically load the course data module, and use lazy/async image decoding and deferred video loading. Keep the initial shell and shared providers available immediately.
- **PWA:** own the app manifest and service worker in the application. Cache the app shell and only same-origin public build assets under `/assets/` and `/icons/`; reject private/no-store and cookie-/authorization-varying responses. Never cache API/auth requests, bearer-authenticated requests, video/audio, or user tokens. Preserve the app's existing local learning state behavior.
- **Accessibility and security:** retain the current visual language while adding visible focus states, keyboard-operable controls, accessible labels/error announcements, and safe URL/input handling. Keep user-provided text rendered as text (not injected HTML); do not introduce client-side secrets or weaken authentication.
- **Deployment:** Vite processes the root HTML entry so it can rewrite source/assets for both `/` and non-root GitHub Pages project bases; verify a subpath build such as `/eduvantage/`. Include the GitHub Actions Pages workflow, Netlify build/SPA fallback configuration, and Vercel build/SPA rewrite configuration. Document independent setup, smoke-check steps, and platform trade-offs. Keep the Vite production build output in `dist/`.
- **Dependencies/toolchain:** keep npm and the supplied package lock, pin the npm package manager metadata, add only the test/PWA-related packages that are needed, and preserve scripts where possible.

## Project structure

- `src/App.jsx`, `src/main.jsx`, `src/context/`, `src/hooks/`: existing app routing, providers, course and learning state; only small integrations for lazy loading/PWA registration.
- `src/components/`, `src/pages/`, `src/data/`, `src/services/`: supplied learning/auth components and data, retained and extended in place in the working copy.
- `src/utils/`: focused security and safe-link helpers used by existing input flows.
- `src/test/` and colocated `*.test.jsx` files: Jest setup, reusable test providers/mocks, and component/interaction tests.
- `public/manifest.webmanifest`, `public/sw.js`, `public/icons/`: application-owned install metadata and offline assets.
- `.github/workflows/`: GitHub Pages production deployment workflow.
- `netlify.toml`, `vercel.json`: static hosting build/routing configuration.
- `README.md`: local test/build instructions, deployment setup, after-deploy checks, and platform comparison.
- `plan.md`, `TODO.md`: approved approach and tracked acceptance outcomes.

## Existing design to preserve

Reuse the supplied EduVantage interface rather than restyling it. The design language is a focused learning dashboard: Inter/system sans typography, indigo/blue actions, slate text and borders, white rounded content cards, compact labels, and restrained transitions. Keep existing page composition and interaction tone. Accessibility changes should improve focus, semantics, and feedback without changing the established brand feel.

## Build and delivery workflow

Install from the copied lockfile, run Jest, lint and create the production build; fix any failures caused by this work. Verify route declarations and production hosting fallbacks. Deliver the managed project source and report which deployment configurations are prepared; do not claim external deployments unless they are actually published and verified.
