const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// JWT secret (move to env later)
const JWT_SECRET = "super-secret-key-change-this";

/**
 * Log an action into SQLite activity table
 */
function logAction(userId, action, meta = {}) {
    const time = new Date().toISOString();
    db.run(
        `INSERT INTO activity (userId, action, meta, time) VALUES (?, ?, ?, ?)`,
        [userId, action, JSON.stringify(meta), time]
    );
}

/**
 * LOGIN (JWT)
 */
app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;

    db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        (err, user) => {
            if (err) {
                console.error("DB error:", err);
                return res.status(500).json({ error: "DB error" });
            }

            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // plaintext password check (bcrypt upgrade later)
            if (user.password !== password) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Build token payload
            const payload = {
                id: user.id,
                username: user.username,
                role: user.role,
                ndaAccepted: !!user.ndaAccepted,
                greenlight: !!user.greenlight
            };

            // Sign JWT
            const token = jwt.sign(payload, JWT_SECRET, {
                expiresIn: "12h"
            });

            res.json({
                token,
                user: payload
            });
        }
    );
});

/**
 * ACCEPT NDA
 */
app.post("/api/nda/accept", (req, res) => {
    const { userId } = req.body;

    db.run(
        `UPDATE users SET ndaAccepted = 1 WHERE id = ?`,
        [userId],
        function (err) {
            if (err) return res.status(500).json({ error: "DB error" });

            logAction(userId, "NDA_ACCEPTED");

            db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, user) => {
                if (err) return res.status(500).json({ error: "DB error" });
                res.json({ success: true, user });
            });
        }
    );
});

/**
 * MEMBER REQUESTS GREEN-LIGHT
 */
app.post("/api/greenlight/request", (req, res) => {
    const { userId } = req.body;

    logAction(userId, "GREENLIGHT_REQUESTED");

    res.json({ success: true, message: "Green-light request recorded" });
});

/**
 * ADMIN APPROVES GREEN-LIGHT
 */
app.post("/api/greenlight/approve", (req, res) => {
    const { adminId, targetUserId } = req.body;

    db.get(
        `SELECT * FROM users WHERE id = ? AND role = 'admin'`,
        [adminId],
        (err, admin) => {
            if (err) return res.status(500).json({ error: "DB error" });
            if (!admin) return res.status(403).json({ error: "Not authorized" });

            db.run(
                `UPDATE users SET greenlight = 1 WHERE id = ?`,
                [targetUserId],
                function (err) {
                    if (err) return res.status(500).json({ error: "DB error" });

                    logAction(adminId, "GREENLIGHT_APPROVED", { targetUserId });

                    db.get(
                        `SELECT * FROM users WHERE id = ?`,
                        [targetUserId],
                        (err, user) => {
                            if (err) return res.status(500).json({ error: "DB error" });
                            res.json({ success: true, user });
                        }
                    );
                }
            );
        }
    );
});

/**
 * POA ACTION (ENFORCED)
 */
app.post("/api/poa/action", (req, res) => {
    const { userId, actionType } = req.body;

    db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, user) => {
        if (err) return res.status(500).json({ error: "DB error" });
        if (!user) return res.status(404).json({ error: "User not found" });

        if (!user.ndaAccepted) {
            return res.status(403).json({ error: "NDA not accepted" });
        }

        if (!user.greenlight) {
            return res.status(403).json({ error: "Green-light not granted" });
        }

        logAction(userId, "POA_ACTION", { actionType });

        res.json({ success: true, message: "POA action executed" });
    });
});

/**
 * PUBLIC ACTIVITY FEED
 */
app.get("/api/activity", (req, res) => {
    db.all(`SELECT * FROM activity ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json(rows);
    });
});

/**
 * ADMIN ROUTES
 */
require("./routes/admin")(app, db, logAction);

/**
 * START SERVER
 */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`POA/NDA backend running on port 4000`);
});
