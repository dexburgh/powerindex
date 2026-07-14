// storage.js - Data Persistence
function saveResults(profile) {
    try {
        localStorage.setItem('ARCHITECT_IDENTITY', JSON.stringify(profile));
    } catch (e) {
        console.error("Storage failed:", e);
    }
}
