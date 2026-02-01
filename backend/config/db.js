app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;

    // Query SQLite for matching user
    db.get(
        `SELECT * FROM users WHERE username = ? AND password = ?`,
        [username, password],
        (err, user) => {
            if (err) {
                console.error("DB error:", err);
                return res.status(500).json({ error: "DB error" });
            }

            // No user found
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Successful login → return user profile
            res.json({
                id: user.id,
                username: user.username,
                ndaAccepted: !!user.ndaAccepted,
                greenlight: !!user.greenlight,
                role: user.role
            });
        }
    );
});
