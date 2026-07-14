function calculatePower() {
    let best = null;
    let highestScore = -Infinity;

    POWERS.forEach(power => {
        let score = 0;
        for (const trait in power.requirements) {
            const userVal = TRAITS[trait] || 0;
            const reqVal = power.requirements[trait];
            score += (userVal >= reqVal) ? reqVal * 2 : userVal;
        }
        if (score > highestScore) {
            highestScore = score;
            best = power;
        }
    });
    return best;
}

function generateCharacter() {
    return {
        hero: generateHeroName(),
        power: calculatePower(),
        faction: randomFaction(),
        traits: dominantTraits()
    };
}

function runAnalysis(profile) {
    const fill = document.getElementById("analysisFill");
    const text = document.getElementById("analysisText");
    const messages = [
        "Scanning behavioral matrix...", "Mapping neural architecture...",
        "Calculating personality profile...", "Determining power compatibility...",
        "Generating hero identity...", "Finalizing report..."
    ];

    let step = 0;
    const timer = setInterval(() => {
        if (!fill || !text) return;
        fill.style.width = ((step + 1) / messages.length) * 100 + "%";
        text.textContent = messages[step];
        step++;
        if (step === messages.length) {
            clearInterval(timer);
            setTimeout(() => showResults(profile), 700);
        }
    }, 700);
}

function showResults(profile) {
    const resScreen = document.getElementById("resultScreen");
    const anaScreen = document.getElementById("analysisScreen");
    
    if (anaScreen) anaScreen.classList.remove("active");
    if (resScreen) resScreen.classList.add("active");

    document.getElementById("heroTitle").textContent = profile.hero;
    document.getElementById("powerName").textContent = profile.power.name;
    document.getElementById("rarity").textContent = profile.power.rarity;
    
    document.getElementById("summary").innerHTML = `
        <p style="margin-bottom:10px;"><strong>Faction:</strong> ${profile.faction.name}</p>
        <p style="margin-bottom:20px;"><em>${profile.faction.description}</em></p>
        <p>${profile.power.description}</p>
        <div style="margin-top:20px; display:flex; flex-wrap:wrap; gap:8px;">
            ${profile.traits.map(t => `<span style="background:#1a2333; padding:4px 10px; border-radius:4px; font-size:0.7rem; color:var(--cyan); border:1px solid rgba(0,217,255,0.2);">${t[0].toUpperCase()}</span>`).join('')}
        </div>
    `;
}