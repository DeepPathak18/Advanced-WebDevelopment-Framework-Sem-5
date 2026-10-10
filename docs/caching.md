# Practical 9: In-Memory Caching and Query Optimization

## Cache design

The backend creates one shared `node-cache` instance in `server/cache.js`.
The task list uses the fixed key `all_tasks`; each individual task uses
`task_<id>`. The TTL is read from `CACHE_TTL_SECONDS` (in seconds), defaulting
to 60. `GET /tasks` and `GET /tasks/:id` check the cache after authentication.
A cache hit returns the same JSON data with `X-Cache: HIT`; a miss queries
MongoDB, stores a successful result, and returns `X-Cache: MISS`. Missing tasks
and query errors are never cached.

```text
GET /tasks
  -> auth
  -> cache.get("all_tasks")
       -> HIT: return cached task array (200, X-Cache: HIT)
       -> MISS: Task.find() -> cache.set("all_tasks") -> return (200, X-Cache: MISS)

POST /tasks -> create in MongoDB -> delete "all_tasks"
PUT /tasks/:id -> update in MongoDB -> delete "all_tasks" and "task_<id>"
DELETE /tasks/:id -> delete from MongoDB -> delete "all_tasks" and "task_<id>"
```

Authentication runs before cache reads so an unauthenticated request cannot
receive cached task data. Invalidation occurs only after a successful database
write; that prevents failed writes or 404 responses from removing valid cached
entries. Tasks are currently shared between users, so a single list key is
appropriate for the existing query.

## Postman response-time comparison

Use your previously recorded three uncached GET `/tasks` times for the first
column. After starting/restarting the server, the first request is a MISS;
record three subsequent HIT responses for the cached column. Fill all values
from Postman—no measurements are assumed here.

| Reading | Uncached GET /tasks | Cached GET /tasks (HIT) |
|---|---|---|
| 1 | to be filled by student | to be filled by student |
| 2 | to be filled by student | to be filled by student |
| 3 | to be filled by student | to be filled by student |
| Average | to be filled by student | to be filled by student |
| Percentage improvement | to be filled by student | to be filled by student |

Suggested improvement formula: `((uncached average - cached average) / uncached average) * 100`.

## TTL experiment

Change `CACHE_TTL_SECONDS` in your local `server/.env` and restart the server
for each experiment. Do not commit that local file.

| TTL | What I changed | Staleness vs performance observation |
|---|---|---|
| 5 seconds | to be filled by student | to be filled by student |
| 60 seconds | to be filled by student | to be filled by student |
| 300 seconds | to be filled by student | to be filled by student |

## Safe stale-data demonstration

Perform this only on your local lab server with test data:

1. Stop the server, temporarily comment out the `cache.del(ALL_TASKS_KEY)` line
   in the successful POST `/tasks` handler, and restart it.
2. Request GET `/tasks` once to populate the cache, then POST a clearly named
   test task and request GET `/tasks` again. The response can be stale because
   the list key was not invalidated.
3. Restore the `cache.del(ALL_TASKS_KEY)` line immediately and restart the
   server to clear the demonstration cache. Remove the test task if desired.

Do not commit or leave the invalidation line commented out.

## Cache statistics

The protected `GET /debug/cache-stats` endpoint returns `hits`, `misses`,
current `keys`, and the configured `ttlSeconds`. It is for lab demonstration
only and should be removed or restricted in production.

## Known limitations

- The cache is process-local memory and is lost when the server restarts.
- It is not shared between multiple server instances.
- A change made directly in MongoDB or through another API process can remain
  stale in this process's cache until the TTL expires.
- Cached task lists consume server memory; caching is not useful for every
  small or rapidly changing query.
