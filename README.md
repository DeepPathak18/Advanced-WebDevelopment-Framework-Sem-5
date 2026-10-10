# Student Portfolio and Task Manager

A React portfolio and GitHub repository explorer frontend, paired with an
Express and MongoDB task manager API.

## Requirements

- Node.js 20.19+ (20.x) or 22.12+ (Vite 8 requirement)
- A running MongoDB deployment (local or hosted)

## Run with Docker

Prerequisites: Docker Desktop (or Docker Engine) with the Docker Compose v2
plugin.

From the project root, create `.env` from the example:

```powershell
Copy-Item .env.example .env
```

Replace the placeholder `JWT_SECRET` with a private random value. Keep `.env`
private and do not commit it. Compose will stop with a clear error if
`JWT_SECRET` is missing.

```sh
docker compose up --build
```

Open the frontend at `http://localhost:5173`; the API is available at
`http://localhost:5000`. The frontend build embeds that host URL, because the
browser runs on your computer and cannot resolve Docker's `backend` service
name.

MongoDB is reachable by the backend as `mongodb:27017` on the private Compose
network and is not published to a host port by default. To connect MongoDB
Compass, temporarily add this to the `mongodb` service in `docker-compose.yml`:

```yaml
ports:
  - "127.0.0.1:27017:27017"
```

Stop the stack with `docker compose down`. This keeps the named MongoDB data
volume so your data is available the next time you start the stack. To remove
the volume and permanently delete that database data, use
`docker compose down -v`.

| Problem | What to check |
|---|---|
| Port 5173 or 5000 is already in use | Stop the other process or change the corresponding host-side port before starting Compose again. |
| Backend cannot reach MongoDB | Check that the `mongodb` service is healthy and that `MONGO_URI` uses `mongodb://mongodb:27017/taskdb`, not `localhost`. |
| Changes do not appear after editing | Rebuild the images with `docker compose up --build`. |

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
