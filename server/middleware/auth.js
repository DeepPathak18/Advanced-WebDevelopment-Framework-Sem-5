const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.slice('Bearer '.length).trim();

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'Authentication is not configured on this server' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    return next(error);
  }
}

module.exports = { auth };
