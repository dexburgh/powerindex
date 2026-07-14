// storage.js - Data Persistence
function saveResults(profile) {
    try {
        localStorage.setItem('ARCHITECT_IDENTITY', JSON.stringify(profile));
        localStorage.setItem('ARCHITECT_IDENTITY_TIMESTAMP', Date.now().toString());
    } catch (e) {
        console.error("Storage failed:", e);
        // localStorage might be full or blocked in private mode
    }
}

function loadResults() {
    try {
        const raw = localStorage.getItem('ARCHITECT_IDENTITY');
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.error("Load failed:", e);
        return null;
    }
}

function clearResults() {
    try {
        localStorage.removeItem('ARCHITECT_IDENTITY');
        localStorage.removeItem('ARCHITECT_IDENTITY_TIMESTAMP');
    } catch (e) {}
}
