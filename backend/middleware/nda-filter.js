// backend/middleware/nda-filter.js
// Masks sensitive fields before logs or responses.

module.exports = function ndaFilter(req, res, next) {
  req.safeLog = {
    route: req.originalUrl,
    origin: req.vinculum.origin,
    meshNode: req.mesh.node,
    greySpace: req.signal.greySpace
  };
  next();
};
