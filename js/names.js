const PREFIX = [

    "Nova",
    "Omega",
    "Void",
    "Iron",
    "Quantum",
    "Shadow",
    "Echo",
    "Crimson",
    "Chrome",
    "Cipher",
    "Solar",
    "Storm",
    "Ghost",
    "Zero",
    "Titan"

];

const SUFFIX = [

    "Walker",
    "Core",
    "Prime",
    "Knight",
    "Architect",
    "Phantom",
    "Guardian",
    "Pulse",
    "Sentinel",
    "Forge",
    "Breaker",
    "Nova",
    "Vortex",
    "Edge"

];

function generateHeroName() {

    const first = PREFIX[Math.floor(Math.random() * PREFIX.length)];

    const second = SUFFIX[Math.floor(Math.random() * SUFFIX.length)];

    return `${first} ${second}`;

}