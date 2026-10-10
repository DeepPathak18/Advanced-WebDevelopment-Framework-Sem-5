# Student Portfolio and Task Manager

A React portfolio and GitHub repository explorer frontend, paired with an
Express and MongoDB task manager API.

## Requirements

- Node.js 18 or newer
- A running MongoDB deployment (local or hosted)

## Run the frontend

From the project root:

```sh
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

## Run the backend

In a second terminal:

```sh
cd server
npm install
```

Copy `.env.example` to `.env`, replace `MONGO_URI` with your
MongoDB connection string, and set `JWT_SECRET` to a private random value.
Generate one with:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Keep the generated value in your ignored `server/.env`; do not commit it. Then
start the API:

```sh
npm run dev
```

The API listens on port `5000` by default. The server will not start if
`MONGO_URI` or `JWT_SECRET` is missing, or if MongoDB is unavailable.
Never commit `server/.env`.

## Routes

- `/` — Public student-portfolio landing page with Login and Register links
- `/home` — Personalized home page after login
- `/portfolio` — Protected About, Skills, and project page
- `/projects` — Protected task manager
- `/github` — Protected GitHub Repos explorer
- `/tasks` — Protected task manager (same page as `/projects`)
- `/login` and `/register` — Public authentication pages
- `/contact` — Protected controlled message input, live preview, and character count
- Any unknown URL — Custom 404 page with a link to Home

Route pages for `/projects`, `/github`, `/tasks`, `/contact`, `/login`, and
`/register` are loaded lazily, so their JavaScript chunks are fetched when the
route is first visited.

The navigation bar includes a dark/light mode toggle. The Contact page includes
a Help toggle.

## Performance

The Practical 8 before/after build sizes and browser measurement placeholders
are recorded in [docs/performance.md](docs/performance.md).

## Caching

Practical 9 adds in-memory caching for task reads, write invalidation, and
cache statistics. See [docs/caching.md](docs/caching.md) for the design and
the Postman measurement tables.

## API used

The GitHub Repos page uses the public GitHub REST API endpoint:

```text
https://api.github.com/users/<username>/repos
```

No authentication is needed for public repositories. The username is set in
`src/pages/Projects.jsx`; change `GITHUB_USERNAME` there to explore another
GitHub account. The frontend checks HTTP errors, shows loading and error states,
and supports retrying and filtering results.

## Backend endpoints

| Method | Endpoint | Success status | Description |
|---|---|---:|---|
| GET | `/tasks` | 200 | List tasks |
| POST | `/tasks` | 201 | Create a task; requires `Content-Type: application/json` and a title |
| GET | `/tasks/:id` | 200 | Get one task |
| PUT | `/tasks/:id` | 200 | Update a task; requires `Content-Type: application/json` |
| DELETE | `/tasks/:id` | 200 | Delete a task |

Invalid IDs and validation failures return 400 JSON errors, unsupported request
content types return 415, missing tasks/routes return 404, and unexpected
server errors return 500.
"# Advanced-WebDevelopment-Framework-Sem-5" 
