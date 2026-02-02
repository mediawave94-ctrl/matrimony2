const calculateDNA = (personalityData) => {
    // Basic heuristic logic (MVP)
    // In a real app, this would be a weighted algorithm or AI model

    let emotionalScore = 50;
    let thinkingScore = 50;
    let lifestyleScore = 50;

    // Adjust based on Conflict Handling
    // Adjust based on Conflict Handling
    if (personalityData.conflictHandling === 'avoid') emotionalScore -= 10;
    if (personalityData.conflictHandling === 'address_calm') { emotionalScore += 20; thinkingScore += 10; }
    if (personalityData.conflictHandling === 'emotional') emotionalScore += 30;
    if (personalityData.conflictHandling === 'assertive') thinkingScore += 20;

    // Adjust based on Lifestyle
    if (personalityData.lifestyle === 'homebody') lifestyleScore -= 10;
    if (personalityData.lifestyle === 'adventure') lifestyleScore += 30;

    // Adjust based on Financial
    if (personalityData.financialMindset === 'saver') thinkingScore += 15;
    if (personalityData.financialMindset === 'spender') lifestyleScore += 15;

    // Clamp values 0-100
    const clamp = (num) => Math.min(Math.max(num, 0), 100);

    return {
        emotional: clamp(emotionalScore),
        thinking: clamp(thinkingScore),
        lifestyle: clamp(lifestyleScore)
    };
};

module.exports = calculateDNA;
