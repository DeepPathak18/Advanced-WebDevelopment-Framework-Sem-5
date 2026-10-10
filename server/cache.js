const NodeCache = require('node-cache');

const parsedTtl = Number.parseInt(process.env.CACHE_TTL_SECONDS, 10);
const ttlSeconds = Number.isInteger(parsedTtl) && parsedTtl > 0 ? parsedTtl : 60;

// Export one shared instance so every route reads and invalidates the same cache.
// Route handlers only read cached Mongoose results, so avoid cloning them per request.
const cache = new NodeCache({ stdTTL: ttlSeconds, useClones: false });
cache.ttlSeconds = ttlSeconds;
cache.stats = { hits: 0, misses: 0 };
cache.taskKey = (id) => `task_${id}`;

module.exports = cache;
