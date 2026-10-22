# Experiment 1: Test E-Learning Components

**Topics:** Component Testing, Jest, React Testing Library

## Aim

Use Jest and React Testing Library to verify the e-learning application's course, learning, assessment, search, enrollment, and progress components through user-facing interactions.

## Objectives

By completing this experiment, you will:

1. Test course cards, course details, learning materials, and quiz components.
2. Test course search and filtering.
3. Test course enrollment functionality.
4. Test learning-progress updates.
5. Test quiz and assignment interactions.
6. Use Jest and React Testing Library to verify the components.

## Requirements

- Node.js 22 (recommended for the versions in this project)
- npm (bundled with Node.js)
- Visual Studio Code

## Open and run in VS Code

1. Extract the ZIP file to a normal folder.
2. In VS Code, choose **File → Open Folder…** and select the extracted `EduVantage-learning-experiments` folder (the folder containing `package.json`).
3. Open the integrated terminal with **Terminal → New Terminal** or press **Ctrl+`**.
4. Install the project dependencies once:

   ```powershell
   npm ci
   ```

5. Run the focused Experiment 1 tests:

   ```powershell
   npm run test:experiment1
   ```

6. Optionally run every project test:

   ```powershell
   npm test
   ```

7. To launch the e-learning app in a browser, run this in another terminal:

   ```powershell
   npm run dev
   ```

   Open the local URL printed by Vite, usually `http://localhost:5173/`. Stop the dev server with **Ctrl+C**.

## Objective-to-test map

| Objective | Existing test coverage |
|---|---|
| Course cards and details | `src/components/courses/CourseCard.test.jsx`; `src/pages/CourseDetail.test.jsx` |
| Learning materials and quizzes | `src/components/learning/LearningInteractions.test.jsx` |
| Search and filtering | `src/components/courses/CourseCard.test.jsx`; `src/components/courses/CourseList.test.jsx` |
| Enrollment | `src/components/courses/CourseCard.test.jsx`; `src/pages/CourseDetail.test.jsx`; `src/components/learning/LearningInteractions.test.jsx` |
| Learning-progress updates | `src/components/learning/LearningInteractions.test.jsx`; `src/context/LearningContext.test.jsx` |
| Quiz and assignment interactions | `src/components/learning/LearningInteractions.test.jsx` |
| Jest and React Testing Library setup | `jest.config.cjs`; `src/test/setup.js`; tests use `@testing-library/react` and `@testing-library/user-event` |

The tests exercise accessible UI controls, real React context/provider behavior, and persisted learning state in `localStorage`; they do not require a live backend service.

## Expected result

`npm run test:experiment1` should finish with **5 test suites passed** and **12 tests passed**. Jest prints each passing test file and a final summary similar to:

```text
Test Suites: 5 passed, 5 total
Tests:       12 passed, 12 total
Snapshots:   0 total
```

The exact elapsed time can vary by computer.

## Windows troubleshooting

If `npm ci` reports `EBUSY` for a path under `node_modules`, stop any running Vite server with **Ctrl+C**, close terminals or tools using the project files, then in PowerShell run:

```powershell
Remove-Item -LiteralPath .\node_modules -Recurse -Force
npm ci
```

If PowerShell still reports that files are busy, restart Windows and run `npm ci` again from the project folder. Do not delete `package-lock.json`.

This ZIP is a frontend Vite application and does not contain a separate `server/` folder. Use `npm run dev` to launch the app; the PDF reference's `npm --prefix server run dev` command belongs to a different project.
