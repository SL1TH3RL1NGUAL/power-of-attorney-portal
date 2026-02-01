const API_BASE = "http://localhost:4000/api";

async function apiLogin(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
}

async function apiAcceptNDA(userId) {
    const res = await fetch(`${API_BASE}/nda/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
    });
    if (!res.ok) throw new Error("NDA accept failed");
    return res.json();
}

async function apiRequestGreenlight(userId) {
    const res = await fetch(`${API_BASE}/greenlight/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
    });
    if (!res.ok) throw new Error("Green-light request failed");
    return res.json();
}

async function apiApproveGreenlight(adminId, targetUserId) {
    const res = await fetch(`${API_BASE}/greenlight/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, targetUserId })
    });
    if (!res.ok) throw new Error("Green-light approve failed");
    return res.json();
}

async function apiPOAAction(userId, actionType) {
    const res = await fetch(`${API_BASE}/poa/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, actionType })
    });
    if (!res.ok) throw new Error("POA action failed");
    return res.json();
}

async function apiGetActivity() {
    const res = await fetch(`${API_BASE}/activity`);
    if (!res.ok) throw new Error("Activity fetch failed");
    return res.json();
}
