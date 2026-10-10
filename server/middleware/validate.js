const VALID_PRIORITIES = ['low', 'medium', 'high'];

function validateTaskCreate(req, res, next) {
  const { title, priority } = req.body || {};

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: 'Priority must be one of low, medium, or high' });
  }

  next();
}

function validateTaskUpdate(req, res, next) {
  const { title, priority, completed } = req.body || {};

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ error: 'Title must be a non-empty string when provided' });
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: 'Priority must be one of low, medium, or high' });
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean when provided' });
  }

  next();
}

module.exports = {
  validateTaskCreate,
  validateTaskUpdate,
};
