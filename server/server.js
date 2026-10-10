require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('./models/Task');
const User = require('./models/User');
const { auth } = require('./middleware/auth');
const { validateTaskCreate, validateTaskUpdate } = require('./middleware/validate');
const cache = require('./cache');

const app = express();
const PORT = process.env.PORT || 5000;
// One key is sufficient because GET /tasks returns the same unfiltered shared list.
const ALL_TASKS_KEY = 'all_tasks';

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

function validateContentType(req, res, next) {
  if ((req.method === 'POST' || req.method === 'PUT') && !req.is('application/json')) {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }
  next();
}

function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid task ID format' });
  }
  next();
}

app.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.trim().toLowerCase();

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email: normalizedEmail, password: hashedPassword });

    return res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    return next(err);
  }
});

app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(String(password), user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Authentication is not configured on this server' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    return next(err);
  }
});

app.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      id: user._id,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (err) {
    return next(err);
  }
});

app.get('/tasks', auth, async (req, res, next) => {
  try {
    // Authenticate before reading shared cached data.
    const cachedTasks = cache.get(ALL_TASKS_KEY);
    if (cachedTasks !== undefined) {
      cache.stats.hits += 1;
      res.set('X-Cache', 'HIT');
      return res.status(200).json(cachedTasks);
    }

    cache.stats.misses += 1;
    res.set('X-Cache', 'MISS');
    const tasks = await Task.find();
    cache.set(ALL_TASKS_KEY, tasks);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

app.get('/tasks/:id', auth, validateObjectId, async (req, res, next) => {
  try {
    const key = cache.taskKey(req.params.id);
    const cachedTask = cache.get(key);
    if (cachedTask !== undefined) {
      cache.stats.hits += 1;
      res.set('X-Cache', 'HIT');
      return res.status(200).json(cachedTask);
    }

    cache.stats.misses += 1;
    res.set('X-Cache', 'MISS');
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    cache.set(key, task);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

app.post('/tasks', auth, validateContentType, validateTaskCreate, async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    // Invalidate only after the write succeeds so failed writes preserve valid data.
    cache.del(ALL_TASKS_KEY);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

app.put('/tasks/:id', auth, validateContentType, validateObjectId, validateTaskUpdate, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    // A task write can stale both the detail response and the list response.
    cache.del([ALL_TASKS_KEY, cache.taskKey(req.params.id)]);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

app.delete('/tasks/:id', auth, validateObjectId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    // Delete both views after a successful write so neither can stay stale.
    cache.del([ALL_TASKS_KEY, cache.taskKey(req.params.id)]);
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
});

// Lab demonstration endpoint; remove or restrict it in a production deployment.
app.get('/debug/cache-stats', auth, (req, res) => {
  res.status(200).json({
    hits: cache.stats.hits,
    misses: cache.stats.misses,
    keys: cache.keys().length,
    ttlSeconds: cache.ttlSeconds,
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack || err.message);

  if (err.code === 11000) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid task ID format' });
  }

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((validationError) => ({
      field: validationError.path,
      message: validationError.message,
    }));
    return res.status(400).json({ error: 'Validation failed', details });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON request body' });
  }

  res.status(500).json({ error: 'Something went wrong' });
});

async function startServer() {
  if (!process.env.CACHE_TTL_SECONDS) {
    console.log('CACHE_TTL_SECONDS is not set; using the default TTL of 60 seconds.');
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing. Add a secure value to server/.env before starting the app.');
    process.exitCode = 1;
    return;
  }

  if (!process.env.MONGO_URI) {
    console.error('MongoDB connection error: MONGO_URI is not configured');
    process.exitCode = 1;
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exitCode = 1;
  }
}

void startServer();
