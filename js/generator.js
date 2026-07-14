function calculatePower() {
    if (typeof POWERS === 'undefined' || !POWERS.length) return null;
    let best = POWERS[0];
    let highestScore = -Infinity;
    POWERS.forEach(power => {
        let score = 0, meetsAll = true;
        for (const trait in power.requirements) {
            const userVal = TRAITS[trait] || 0;
            const reqVal = power.requirements[trait];
            if (userVal < reqVal) meetsAll = false;
            score += (userVal >= reqVal) ? reqVal * 2 : userVal;
        }
        if (meetsAll) score += 22;
        // slight randomness to break ties for replayability
        score += Math.random() * 0.6;
        if (score > highestScore) { highestScore = score; best = power; }
    });
    return best;
}

function generateCharacter() {
    const power = calculatePower();
    if (!power) throw new Error("No power");
    const mode = (typeof getCurrentMode === 'function') ? getCurrentMode() : 'mid';
    return {
        hero: typeof generateHeroName === 'function' ? generateHeroName() : "Unknown Entity",
        power: power,
        faction: typeof randomFaction === 'function' ? randomFaction() : { name: "Unaffiliated", description: "" },
        traits: typeof dominantTraits === 'function' ? dominantTraits() : [],
        rawTraits: { ...TRAITS },
        mode: mode,
        generatedAt: new Date().toISOString()
    };
}

function runAnalysis(profile) {
    const fill = document.getElementById("analysisFill");
    const text = document.getElementById("analysisText");
    if (!fill || !text) { showResults(profile); return; }
    const mode = profile.mode || 'mid';
    const base = [
        "Scanning behavioral matrix...",
        "Mapping neural architecture...",
        "Calculating power compatibility..."
    ];
    const midExtra = ["Profiling leadership pattern...", "Extracting moral alignment..."];
    const fullExtra = ["Simulating long-term payoff...", "Building cognitive model...", "Cross-referencing 14 power archetypes...", "Finalizing dossier..."];
    let messages = [...base];
    if (mode === 'mid') messages = [...base, ...midExtra, "Generating hero identity...", "Finalizing report..."];
    else if (mode === 'full') messages = [...base, ...midExtra, ...fullExtra];
    else messages = [...base, "Generating hero identity...", "Finalizing report..."];

    let step = 0; fill.style.width = "0%";
    const timer = setInterval(() => {
        fill.style.width = ((step + 1) / messages.length) * 100 + "%";
        text.textContent = messages[step];
        step++;
        if (step >= messages.length) { clearInterval(timer); setTimeout(() => showResults(profile), 650); }
    }, mode === 'full' ? 520 : 580);
}

function showResults(profile) {
    const resScreen = document.getElementById("resultScreen");
    const anaScreen = document.getElementById("analysisScreen");
    if (anaScreen) anaScreen.classList.remove("active");
    if (resScreen) resScreen.classList.add("active");

    const heroTitle = document.getElementById("heroTitle");
    const powerName = document.getElementById("powerName");
    const rarity = document.getElementById("rarity");
    const summary = document.getElementById("summary");
    const deepDive = document.getElementById("deepDive");

    const p = profile.power;
    if (heroTitle) heroTitle.textContent = profile.hero;
    if (powerName) {
        powerName.innerHTML = `<span class="power-icon" style="color:${p.color}">${escapeHtml(p.icon||"⬢")}</span> ${escapeHtml(p.name)}`;
        powerName.style.color = p.color || "";
    }
    if (rarity) {
        const cat = p.category ? ` • ${p.category.toUpperCase()}` : "";
        rarity.textContent = `${p.rarity.toUpperCase()}${cat}`;
        rarity.dataset.rarity = p.rarity.toLowerCase();
        rarity.style.color = p.color; rarity.style.borderColor = p.color;
    }

    const mode = profile.mode || 'mid';
    if (summary) {
        summary.innerHTML = buildSummaryHTML(profile, mode);
    }
    if (deepDive) {
        deepDive.innerHTML = mode === 'short' ? "" : buildDeepDiveHTML(profile, mode);
    }
}

function buildSummaryHTML(profile, mode) {
    const p = profile.power;
    const f = profile.faction;
    const traitTags = profile.traits.map(t => `<span class="trait-tag" style="--tag-color:${p.color}">${t[0].toUpperCase()}: ${t[1]}</span>`).join('');

    let html = `
    <div class="epic-header">
        <div class="epic-icon-wrap" style="--epic-color:${p.color}; border-color:${p.color}55;">
            <div class="epic-icon" style="color:${p.color}">${escapeHtml(p.icon||"⬢")}</div>
            <div class="epic-glow" style="background:${p.color}"></div>
        </div>
        <div class="epic-meta">
            <div class="faction-line"><strong>FACTION:</strong> ${escapeHtml(f.name)}</div>
            <div class="faction-desc">${escapeHtml(f.description)}</div>
            <div class="power-desc">${escapeHtml(p.description)}</div>
        </div>
    </div>
    <div class="traits-grid">${traitTags}</div>`;

    if (mode === 'mid' || mode === 'full') {
        html += `
        <div class="split-grid">
            <div class="panel strengths">
                <h4><span>◆</span> CORE STRENGTHS</h4>
                <ul>${(p.strengths||[]).map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ul>
            </div>
            <div class="panel weaknesses">
                <h4><span>◇</span> WEAKNESSES / COST</h4>
                <ul>${(p.weaknesses||[]).map(w=>`<li>${escapeHtml(w)}</li>`).join('')}</ul>
            </div>
        </div>
        <div class="payoff" style="border-color:${p.color}33">
            <div class="payoff-label" style="color:${p.color}">PAYOFF — THE PRICE & THE PRIZE</div>
            <p>${escapeHtml(p.payoff||"Power always costs.")}</p>
        </div>`;
    }
    return html;
}

function buildDeepDiveHTML(profile, mode) {
    const p = profile.power;
    const raw = profile.rawTraits || {};
    const top = profile.traits.slice(0,3).map(t=>t[0]).join(", ");

    let html = `<div class="dossier-divider"><span>DOSSIER // ${mode.toUpperCase()} ANALYSIS</span></div>`;

    // Personality snapshot for mid+
    const snapshot = generatePersonalitySnapshot(profile.traits);
    html += `<div class="panel insight"><h4>PERSONALITY SNAPSHOT</h4><p>${snapshot}</p><div class="mini-meta">Top drivers: ${escapeHtml(top)}</div></div>`;

    if (mode === 'full') {
        const bars = Object.entries(raw).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([k,v])=>{
            const max = Math.max(...Object.values(raw),1);
            const pct = Math.round((v/max)*100);
            return `<div class="trait-bar"><span class="tb-label">${k}</span><div class="tb-track"><div class="tb-fill" style="width:${pct}%; background:${p.color}"></div></div><span class="tb-val">${v}</span></div>`;
        }).join('');

        const leadership = (raw.leadership||0)+(raw.confidence||0)+(raw.ambition||0);
        const moral = (raw.justice||0)+(raw.empathy||0);
        const chaosScore = (raw.chaos||0)+(raw.risk||0);

        let alignment = "Pragmatic Neutral";
        if (moral > 14 && leadership > 10) alignment = "Paragon Leader";
        else if (moral > 14) alignment = "Guardian";
        else if (chaosScore > 12) alignment = "Chaotic Catalyst";
        else if (leadership > 12) alignment = "Sovereign";
        else if ((raw.independence||0) > 10) alignment = "Lone Vector";

        html += `
        <div class="split-grid">
            <div class="panel"><h4>COGNITIVE PROFILE</h4><p>${generateCognitiveProfile(raw)}</p></div>
            <div class="panel"><h4>LEADERSHIP STYLE</h4><p>${generateLeadershipStyle(raw)}</p></div>
        </div>
        <div class="panel"><h4>MORAL ALIGNMENT: ${alignment}</h4><p>${generateMoralNote(raw, alignment)}</p></div>
        <div class="panel"><h4>TRAIT MAP // RAW SIGNAL</h4><div class="trait-bars">${bars}</div></div>`;
    }
    return html;
}

function generatePersonalitySnapshot(traits) {
    if (!traits.length) return "Balanced, unreadable, or intentionally masked. The system could not isolate a dominant driver.";
    const map = {
        intelligence:"You deconstruct before you feel. Understanding is your safety.",
        leadership:"You organize chaos into direction. People move when you speak.",
        empathy:"You track the room's emotional weather before your own.",
        creativity:"You see sideways. Where others see walls, you see doors.",
        discipline:"You win by outlasting. Routine is your weapon.",
        control:"You need order to think clearly. You create it if it doesn't exist.",
        chaos:"You thrive when plans fail. That's when you're most honest.",
        justice:"You keep score on fairness even when no one else does.",
        ambition:"You are building something larger than yourself and you know it.",
        confidence:"You assume you can, then figure out how.",
        adaptability:"You bend without breaking. Survival through shape-shifting.",
        resilience:"You absorb damage that would stop others and keep walking.",
        patience:"You play long games others quit.",
        risk:"You trade safety for velocity.",
        curiosity:"You must know. Not knowing is itch, not mystery.",
        innovation:"You don't improve systems, you replace them.",
        independence:"You trust yourself first. It's not arrogance, it's data.",
        courage:"You act while afraid. That's the definition you live."
    };
    return traits.slice(0,2).map(t=>map[t[0]]||`${t[0]} drives you.`).join(" ");
}

function generateCognitiveProfile(raw){
    if ((raw.intelligence||0) > 12 && (raw.curiosity||0) > 8) return "First-principles thinker. You reduce problems to physics, then rebuild. Slow to decide, devastating when decided.";
    if ((raw.intelligence||0) > 10 && (raw.control||0) > 10) return "Architect mind. You build mental models and live inside them. Strong on strategy, must watch for over-modeling people.";
    if ((raw.creativity||0) > 8 || (raw.innovation||0) > 9) return "Lateral processor. You connect distant domains. Your best ideas come when not trying.";
    if ((raw.adaptability||0) > 10) return "Fluid processor. You update beliefs fast. Dangerous in static environments, lethal in volatile ones.";
    return "Balanced processor. You blend logic, intuition, and social data without over-indexing on one.";
}
function generateLeadershipStyle(raw){
    if ((raw.leadership||0) > 7 && (raw.empathy||0) > 8) return "Servant Commander. You lead from the front but listen first. Teams feel safe and driven.";
    if ((raw.leadership||0) > 7 && (raw.confidence||0) > 8) return "Sovereign. Decisive, visible, high-expectation. People follow because you already decided you will win.";
    if ((raw.independence||0) > 9) return "Lone Wolf Prime. You lead by example, not meetings. Best with autonomous operators.";
    if ((raw.discipline||0) > 9) return "Fortress. You lead with systems and standards. Unsexy, unbeatable over time.";
    return "Catalyst. You don't manage, you ignite. Best at start, delegate the middle.";
}
function generateMoralNote(raw, alignment){
    const notes = {
        "Paragon Leader":"You believe power must serve. Your flaw is carrying too much.",
        "Guardian":"You protect what others exploit. Watch for burnout.",
        "Chaotic Catalyst":"You break bad rules. Ensure you build better ones after.",
        "Sovereign":"You think order is kindness. Sometimes it is. Sometimes it's control.",
        "Lone Vector":"You trust your compass over the crowd. Make sure it's calibrated.",
        "Pragmatic Neutral":"You are not cruel or kind on principle — you are effective. Your alignment is chosen daily."
    };
    return notes[alignment]||"Your morality is situational, but your pattern is consistent under pressure.";
}

function escapeHtml(str){ const d=document.createElement('div'); d.textContent=str; return d.innerHTML; }
