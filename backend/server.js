// backend/server.js
// Core backend entrypoint for the stateless capsule‑mesh architecture.

const express = require('express');
const bodyParser = require('body-parser');
const applyMiddleware = require('./middleware');

const app = express();

// Parse JSON bodies
app.use(bodyParser.json());

// Load middleware spine (Vinculum, signal, mesh, NDA)
applyMiddleware(app);

// Test route for signal ingestion
app.post('/signal', (req, res) => {
  res.json({
    message: 'Signal received',
    vinculum: req.vinculum,
    signal: req.signal,
    mesh: req.mesh,
    safeLog: req.safeLog
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    node: process.env.NODE_ID || 'node-000',
    timestamp: Date.now()
  });
});

// Default port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Orb‑OS backend running on port ${PORT}`);
});
