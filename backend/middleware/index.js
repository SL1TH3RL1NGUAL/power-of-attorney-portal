// backend/middleware/index.js
// Loads and chains all middleware functions in order.

const vinculumBinding = require('./vinculum-binding');
const signalNormalizer = require('./signal-normalizer');
const meshHandshake = require('./mesh-handshake');
const ndaFilter = require('./nda-filter');

module.exports = function applyMiddleware(app) {
  app.use(vinculumBinding);
  app.use(signalNormalizer);
  app.use(meshHandshake);
  app.use(ndaFilter);
};
