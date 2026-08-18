# TaskNest Productivity Improvement

TaskNest is a React and Express task manager improved to make its Productivity Score deterministic and explainable. Users can mark tasks as important, and completed important tasks receive a bonus. Completing tasks on distinct days also contributes a capped consistency bonus.

## Project structure

- `client/` — React + Vite frontend.
- `server/` — Express API, Prisma schema, seed data, and score tests.
- `Changes.md` — investigation findings, interpretation, formula, and implementation notes.

## Local setup

The backend expects a PostgreSQL database configured through the Prisma setup in `server/prisma.config.ts`.

```bash
cd server
npm install
npm run prisma:seed
npm test
npm run dev
```

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Set `VITE_API_URL` when the frontend needs to connect to a deployed backend. The default is `http://localhost:5000`.

## Score formula

```text
score = min(
  (completed tasks × 10)
  + (completed important tasks × 10)
  + min(distinct completed days × 5, 20),
  100
)
```

The score endpoint returns the total and its component values so the dashboard can explain the result rather than displaying an opaque number.
