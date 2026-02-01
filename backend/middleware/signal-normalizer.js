// backend/middleware/signal-normalizer.js
// Normalizes incoming signal-like data into a consistent structure.

module.exports = function signalNormalizer(req, res, next) {
  const raw = req.body || {};

  req.signal = {
    rf: raw.rf || null,
    cellular: raw.cellular || null,
    thermal: raw.thermal || null,
    electrical: raw.electrical || null,
    emf: raw.emf || null,
    confidence: raw.confidence || 0.0,
    greySpace: raw.confidence < 0.3
  };

  next();
};
