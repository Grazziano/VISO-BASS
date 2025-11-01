# Running end-to-end (e2e) tests

This project includes e2e tests that exercise HTTP endpoints using a real NestJS application and an
in-memory MongoDB instance (mongodb-memory-server). That means you don't need a running MongoDB
server to execute the suite locally or in CI.

Quick start (local)

1. Install dependencies:

```powershell
npm ci
```

2. Run the e2e suite:

```powershell
npm run test:e2e
```

If you need more diagnostic information about leaking handles, run:

```powershell
npm run test:e2e -- --detectOpenHandles
```

CI

A basic GitHub Actions workflow was added at `.github/workflows/e2e.yml`. It checks out the
repo, installs dependencies (`npm ci`) and runs `npm run test:e2e`. The workflow relies on the
`mongodb-memory-server` package to provide an ephemeral MongoDB during the test run.

Notes

- Tests already set sensible defaults for JWT (when necessary) and use the `test/e2e-utils.ts`
  helper to spin up the Nest application and the in-memory DB.
- If your CI environment blocks spawned processes, ensure Node can spawn child processes —
  `mongodb-memory-server` downloads a MongoDB binary on first run and spawns it when tests start.
