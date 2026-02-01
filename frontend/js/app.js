// Simple view switcher
function showView(id) {
    document.querySelectorAll(".view").forEach(v => v.style.display = "none");
    document.getElementById(id).style.display = "block";
}

// Login handler
document.getElementById("login-btn").onclick = () => {
    const user = document.getElementById("login-username").value;
    const pass = document.getElementById("login-password").value;

    // Fake login for now
    if (user && pass) {
        onLoginSuccess({ username: user, ndaAccepted: false, greenlight: false });
    }
};

// After login
function onLoginSuccess(profile) {
    window.currentProfile = profile;

    if (!profile.ndaAccepted) {
        showView("view-nda");
        return;
    }

    if (!profile.greenlight) {
        showView("view-greenlight");
        return;
    }

    showView("view-poa");
}

// NDA acceptance
document.getElementById("accept-nda-btn").onclick = () => {
    window.currentProfile.ndaAccepted = true;
    onLoginSuccess(window.currentProfile);
};

// Request green-light
document.getElementById("request-greenlight-btn").onclick = () => {
    window.currentProfile.greenlight = true;
    onLoginSuccess(window.currentProfile);
};

// POA actions
document.getElementById("poa-action-1").onclick = () => {
    logAction("Executed POA Action 1");
};

document.getElementById("poa-action-2").onclick = () => {
    logAction("Executed POA Action 2");
};

// Activity feed
document.getElementById("open-feed").onclick = () => {
    showView("view-feed");
    renderFeed();
};

document.getElementById("back-to-poa").onclick = () => {
    showView("view-poa");
};

// Logging
window.activityFeed = [];

function logAction(text) {
    window.activityFeed.push({
        time: new Date().toISOString(),
        user: window.currentProfile.username,
        action: text
    });
}

// Render feed
function renderFeed() {
    const container = document.getElementById("feed-container");
    container.innerHTML = "";

    window.activityFeed.forEach(entry => {
        const div = document.createElement("div");
        div.textContent = `${entry.time} — ${entry.user}: ${entry.action}`;
        container.appendChild(div);
    });
}
