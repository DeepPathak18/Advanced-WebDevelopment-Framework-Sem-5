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

Copy `server/.env.example` to `server/.env`, replace `MONGO_URI` with your
MongoDB connection string, then start the API:

```sh
npm run dev
```

The API listens on port `5000` by default. The server reports a connection
error and does not start listening if MongoDB is unavailable or misconfigured.
Never commit `server/.env`.

## Routes

- `/` — Home: About, Skills, and three hardcoded portfolio projects
- `/projects` — Tasks loaded from the backend
- `/github` — GitHub Repos explorer
- `/tasks` — Tasks loaded from the backend (same page as `/projects`)
- `/contact` — Controlled message input, live preview, and character count
- Any unknown URL — Custom 404 page with a link to Home

The navigation bar includes a dark/light mode toggle. The Contact page includes
a Help toggle.

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
