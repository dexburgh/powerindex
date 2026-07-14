const TRAITS = {
    intelligence: 0, leadership: 0, empathy: 0, creativity: 0, 
    discipline: 0, control: 0, chaos: 0, justice: 0, 
    ambition: 0, confidence: 0, adaptability: 0, resilience: 0, 
    patience: 0, risk: 0, curiosity: 0, innovation: 0, 
    independence: 0, courage: 0
};

function resetTraits() {
    Object.keys(TRAITS).forEach(t => TRAITS[t] = 0);
}

function applyAnswer(answer) {
    if (!answer || !answer.traits) return;
    for (const trait in answer.traits) {
        // allow new traits but track them
        if (!(trait in TRAITS)) {
            console.warn(`Unknown trait "${trait}" - adding dynamically`);
            TRAITS[trait] = 0;
        }
        TRAITS[trait] += answer.traits[trait];
    }
}

function dominantTraits() {
    return Object.entries(TRAITS)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .filter(([_, val]) => val > 0); // don't show 0-value traits
}

function finishQuiz() {
    let profile;
    try {
        profile = generateCharacter();
    } catch (e) {
        console.error("generateCharacter failed:", e);
        return;
    }

    if (typeof saveResults === 'function') saveResults(profile);
    
    const quizScreen = document.getElementById("quizScreen");
    const analysisScreen = document.getElementById("analysisScreen");
    
    if (quizScreen) quizScreen.classList.remove("active");
    if (analysisScreen) analysisScreen.classList.add("active");
    
    if (typeof runAnalysis === 'function') {
        runAnalysis(profile);
    } else {
        console.error("Critical: runAnalysis not found - check generator.js load order");
        // fallback: show results directly
        if (typeof showResults === 'function') showResults(profile);
    }
}
