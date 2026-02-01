// backend/middleware/vinculum-binding.js
// Identity-binding layer (Vinculum)

module.exports = function vinculumBinding(req, res, next) {
  req.vinculum = {
    origin: req.headers['x-origin-id'] || 'anonymous-origin',
    timestamp: Date.now(),
    route: req.originalUrl
  };
  next();
};


