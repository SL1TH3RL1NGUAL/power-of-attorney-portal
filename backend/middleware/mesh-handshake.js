// backend/middleware/mesh-handshake.js
// Stateless router-to-router handshake (recall-agent)

module.exports = function meshHandshake(req, res, next) {
  req.mesh = {
    node: process.env.NODE_ID || 'node-000',
    handshake: 'stateless',
    receivedAt: Date.now()
  };
  next();
};
