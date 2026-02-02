const calculateMatchScore = (userA, userB) => {
    if (!userA.compatibilityDNA || !userB.compatibilityDNA) return 50; // Default if missing data

    const scoreA = userA.compatibilityDNA;
    const scoreB = userB.compatibilityDNA;

    // Calculate similarity (Absolute difference)
    // 100 - Difference. Smaller difference = Higher Score.
    const emotionalDiff = Math.abs(scoreA.emotional - scoreB.emotional);
    const thinkingDiff = Math.abs(scoreA.thinking - scoreB.thinking);
    const lifestyleDiff = Math.abs(scoreA.lifestyle - scoreB.lifestyle);

    const emotionalMatch = Math.max(0, 100 - emotionalDiff);
    const thinkingMatch = Math.max(0, 100 - thinkingDiff);
    const lifestyleMatch = Math.max(0, 100 - lifestyleDiff);

    // Weighted Total (Can customize weights)
    // Emotional compatibility is often most important in long term
    const totalScore = Math.round(
        (emotionalMatch * 0.4) +
        (thinkingMatch * 0.3) +
        (lifestyleMatch * 0.3)
    );

    return {
        total: totalScore,
        details: {
            emotional: emotionalMatch,
            thinking: thinkingMatch,
            lifestyle: lifestyleMatch
        }
    };
};

module.exports = calculateMatchScore;
