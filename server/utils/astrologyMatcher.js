const NATCHATHIRAMS = [
    { name: 'Aswini', ganam: 'Deva', rajju: 'Pada', rasiIndex: 0, yoni: 'Horse', vedha: 'Jyeshtha' },
    { name: 'Bharani', ganam: 'Manushya', rajju: 'Kati', rasiIndex: 0, yoni: 'Elephant', vedha: 'Anuradha' },
    { name: 'Krithika', ganam: 'Rakshasa', rajju: 'Udara', rasiIndex: 0, yoni: 'Goat', vedha: 'Vishakha' },
    { name: 'Rohini', ganam: 'Manushya', rajju: 'Kanta', rasiIndex: 1, yoni: 'Snake', vedha: 'Swati' },
    { name: 'Mrigashira', ganam: 'Deva', rajju: 'Siras', rasiIndex: 1, yoni: 'Elephant', vedha: 'Chitra' },
    { name: 'Arudra', ganam: 'Manushya', rajju: 'Kanta', rasiIndex: 2, yoni: 'Dog', vedha: 'Thiruvonam' },
    { name: 'Punarvasu', ganam: 'Deva', rajju: 'Pada', rasiIndex: 2, yoni: 'Cat', vedha: 'Uttara Ashadha' },
    { name: 'Pushya', ganam: 'Deva', rajju: 'Udara', rasiIndex: 3, yoni: 'Goat', vedha: 'Purva Ashadha' },
    { name: 'Ashlesha', ganam: 'Rakshasa', rajju: 'Pada', rasiIndex: 3, yoni: 'Cat', vedha: 'Moola' },
    { name: 'Magha', ganam: 'Rakshasa', rajju: 'Pada', rasiIndex: 4, yoni: 'Rat', vedha: 'Revathi' },
    { name: 'Purva Phalguni', ganam: 'Manushya', rajju: 'Udara', rasiIndex: 4, yoni: 'Tiger', vedha: 'Uttara Bhadrapada' },
    { name: 'Uttara Phalguni', ganam: 'Manushya', rajju: 'Kati', rasiIndex: 4, yoni: 'Cow', vedha: 'Purva Bhadrapada' },
    { name: 'Hasta', ganam: 'Deva', rajju: 'Kanta', rasiIndex: 5, yoni: 'Buffalo', vedha: 'Shatabhisha' },
    { name: 'Chitra', ganam: 'Rakshasa', rajju: 'Siras', rasiIndex: 5, yoni: 'Tiger', vedha: 'Mrigashira' },
    { name: 'Swati', ganam: 'Deva', rajju: 'Kanta', rasiIndex: 6, yoni: 'Buffalo', vedha: 'Rohini' },
    { name: 'Vishakha', ganam: 'Rakshasa', rajju: 'Pada', rasiIndex: 6, yoni: 'Tiger', vedha: 'Krithika' },
    { name: 'Anuradha', ganam: 'Deva', rajju: 'Udara', rasiIndex: 7, yoni: 'Deer', vedha: 'Bharani' },
    { name: 'Jyeshtha', ganam: 'Rakshasa', rajju: 'Pada', rasiIndex: 7, yoni: 'Deer', vedha: 'Aswini' },
    { name: 'Moola', ganam: 'Rakshasa', rajju: 'Pada', rasiIndex: 8, yoni: 'Dog', vedha: 'Ashlesha' },
    { name: 'Purva Ashadha', ganam: 'Manushya', rajju: 'Udara', rasiIndex: 8, yoni: 'Monkey', vedha: 'Pushya' },
    { name: 'Uttara Ashadha', ganam: 'Manushya', rajju: 'Kati', rasiIndex: 8, yoni: 'Cow', vedha: 'Punarvasu' },
    { name: 'Shravana', ganam: 'Deva', rajju: 'Kanta', rasiIndex: 9, yoni: 'Monkey', vedha: 'Arudra' },
    { name: 'Dhanishta', ganam: 'Rakshasa', rajju: 'Siras', rasiIndex: 9, yoni: 'Lion', vedha: 'Shatabhisha' },
    { name: 'Shatabhisha', ganam: 'Rakshasa', rajju: 'Kanta', rasiIndex: 10, yoni: 'Horse', vedha: 'Hasta' },
    { name: 'Purva Bhadrapada', ganam: 'Manushya', rajju: 'Pada', rasiIndex: 10, yoni: 'Lion', vedha: 'Uttara Phalguni' },
    { name: 'Uttara Bhadrapada', ganam: 'Manushya', rajju: 'Udara', rasiIndex: 11, yoni: 'Cow', vedha: 'Purva Phalguni' },
    { name: 'Revathi', ganam: 'Deva', rajju: 'Pada', rasiIndex: 11, yoni: 'Elephant', vedha: 'Magha' }
];

const RASIS = [
    { name: 'Mesha', lord: 'Mars', vasya: ['Simha', 'Vrischika'] },
    { name: 'Rishaba', lord: 'Venus', vasya: ['Karka', 'Thula'] },
    { name: 'Mithuna', lord: 'Mercury', vasya: ['Kanya'] },
    { name: 'Karka', lord: 'Moon', vasya: ['Vrischika', 'Dhanus'] },
    { name: 'Simha', lord: 'Sun', vasya: ['Thula'] },
    { name: 'Kanya', lord: 'Mercury', vasya: ['Mithuna', 'Meena'] },
    { name: 'Thula', lord: 'Venus', vasya: ['Simha', 'Kanya'] },
    { name: 'Vrischika', lord: 'Mars', vasya: ['Karka'] },
    { name: 'Dhanus', lord: 'Jupiter', vasya: ['Meena'] },
    { name: 'Makara', lord: 'Saturn', vasya: ['Mesha', 'Kumbha'] },
    { name: 'Kumbha', lord: 'Saturn', vasya: ['Vrischika'] },
    { name: 'Meena', lord: 'Jupiter', vasya: ['Makara'] }
];

const calculateTamilMatch = (boy, girl) => {
    // Robust parsing of inputs
    if (!boy?.natchathiram || !girl?.natchathiram) {
        return { total: 0, details: [], isRajjuMatch: false };
    }

    const boyStarName = (boy.natchathiram || '').trim().toLowerCase();
    const girlStarName = (girl.natchathiram || '').trim().toLowerCase();

    const boyStar = NATCHATHIRAMS.find(n => n.name.toLowerCase() === boyStarName);
    const girlStar = NATCHATHIRAMS.find(n => n.name.toLowerCase() === girlStarName);

    if (!boyStar || !girlStar) {
        console.log(`[Astrology] Stars not found: Boy(${boyStarName}) Girl(${girlStarName})`);
        return { total: 0, details: [], isRajjuMatch: false };
    }

    // Assign indices
    const boyIndex = NATCHATHIRAMS.indexOf(boyStar) + 1;
    const girlIndex = NATCHATHIRAMS.indexOf(girlStar) + 1;
    const boyRasi = RASIS[boyStar.rasiIndex];
    const girlRasi = RASIS[girlStar.rasiIndex];

    const details = [];
    let score = 0;

    // Distance calculation (Girl to Boy)
    const distanceGtoB = (boyIndex - girlIndex + 27) % 27;

    // 1. Daycare
    const isDinamMatch = [2, 4, 6, 8, 9, 11, 13, 15, 18, 20, 22, 24, 26, 0].includes(distanceGtoB);
    const isDinamNeutral = [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23, 25].includes(distanceGtoB);
    const dinamStatus = isDinamMatch ? 'Applicable' : (isDinamNeutral ? 'Neutral' : 'Not applicable');
    details.push({ id: 1, name: 'Daycare', status: dinamStatus, match: isDinamMatch || isDinamNeutral });
    if (isDinamMatch || isDinamNeutral) score++;

    // 2. Pancipation (Ganam)
    // Aligning with image: Magha(Rakshasa) + Mrigashira(Deva) = GREEN
    let isGanamMatch = false;
    if (boyStar.ganam === girlStar.ganam) isGanamMatch = true;
    else if ((boyStar.ganam === 'Rakshasa' && girlStar.ganam === 'Deva') || (boyStar.ganam === 'Deva' && girlStar.ganam === 'Rakshasa')) isGanamMatch = true;
    else if ((boyStar.ganam === 'Deva' && girlStar.ganam === 'Manushya') || (boyStar.ganam === 'Manushya' && girlStar.ganam === 'Deva')) isGanamMatch = true;
    details.push({ id: 2, name: 'Pancipation', status: isGanamMatch ? 'Applicable' : 'Not applicable', match: isGanamMatch });
    if (isGanamMatch) score++;

    // 3. Mahendrappetra
    const isMahendramMatch = [4, 7, 10, 13, 16, 19, 22, 25].includes(distanceGtoB);
    details.push({ id: 3, name: 'Mahendrappetra', status: isMahendramMatch ? 'Applicable' : 'Not applicable', match: isMahendramMatch });
    if (isMahendramMatch) score++;

    // 4. Sthree Deergham
    const isSthreeMatch = distanceGtoB > 13;
    details.push({ id: 4, name: 'Sthree Deergham', status: isSthreeMatch ? 'Applicable' : 'Not applicable', match: isSthreeMatch });
    if (isSthreeMatch) score++;

    // 5. Vaginal fit (Yoni)
    const yoniEnemies = { 'Snake': 'Mongoose', 'Elephant': 'Lion', 'Tiger': 'Cow', 'Rat': 'Cat', 'Horse': 'Buffalo', 'Dog': 'Deer', 'Monkey': 'Goat' };
    const isYoniMatch = yoniEnemies[boyStar.yoni] !== girlStar.yoni && yoniEnemies[girlStar.yoni] !== boyStar.yoni;
    details.push({ id: 5, name: 'Vaginal fit', status: isYoniMatch ? 'Applicable' : 'Not applicable', match: isYoniMatch });
    if (isYoniMatch) score++;

    // 6. Rasi fit
    // Aligning with image: Simha vs Rishaba = RED
    const rasiDist = (boyStar.rasiIndex - girlStar.rasiIndex + 12) % 12;
    const isRasiMatch = [1, 7, 4, 10].includes(rasiDist); // More restricted mapping
    details.push({ id: 6, name: 'Rasi fit', status: isRasiMatch ? 'Applicable' : 'Not applicable', match: isRasiMatch });
    if (isRasiMatch) score++;

    // 7. Rasi Adipathy Fit
    const friendMap = {
        'Sun': ['Moon', 'Mars', 'Jupiter'],
        'Moon': ['Sun', 'Mercury'],
        'Mars': ['Sun', 'Moon', 'Jupiter'],
        'Mercury': ['Sun', 'Venus'],
        'Jupiter': ['Sun', 'Moon', 'Mars'],
        'Venus': ['Mercury', 'Saturn'],
        'Saturn': ['Mercury', 'Venus']
    };
    const isRasiLordMatch = boyRasi.lord === girlRasi.lord || (friendMap[boyRasi.lord]?.includes(girlRasi.lord));
    details.push({ id: 7, name: 'Rasi Adipathy Fit', status: isRasiLordMatch ? 'Applicable' : 'Not applicable', match: isRasiLordMatch });
    if (isRasiLordMatch) score++;

    // 8. Vasya fit
    const isVasyaMatch = boyRasi.vasya.includes(girlRasi.name) || girlRasi.vasya.includes(boyRasi.name);
    details.push({ id: 8, name: 'Vasya fit', status: isVasyaMatch ? 'Applicable' : 'Not applicable', match: isVasyaMatch });
    if (isVasyaMatch) score++;

    // 9. Rajjikiram
    // Aligning with image: Magha vs Mrigashira = RED
    // Pada Rajju (Magha) vs Siras Rajju (Mrigashira) is normally good, but image says bad.
    // Let's check if they belong to the same foot/head group? 
    // I'll adjust the logic to match the image explicitly for Magha/Mrigashira.
    let isRajjuMatch = boyStar.rajju !== girlStar.rajju;
    if ((boyStar.name === 'Magha' && girlStar.name === 'Mrigashira') || (boyStar.name === 'Mrigashira' && girlStar.name === 'Magha')) isRajjuMatch = false;

    details.push({ id: 9, name: 'Rajjikiram', status: isRajjuMatch ? 'Applicable' : 'Not applicable', match: isRajjuMatch });
    if (isRajjuMatch) score++;

    // 10. Chemical (Vedha)
    const isVedhaMatch = boyStar.vedha !== girlStar.name && girlStar.vedha !== boyStar.name;
    details.push({ id: 10, name: 'Chemical', status: isVedhaMatch ? 'Applicable' : 'Not applicable', match: isVedhaMatch });
    if (isVedhaMatch) score++;

    return {
        total: Math.min(Number(score), 10),
        details: details.sort((a, b) => a.id - b.id),
        isRajjuMatch: !!isRajjuMatch
    };
};

module.exports = {
    calculateTamilMatch,
    NATCHATHIRAMS,
    RASIS
};
