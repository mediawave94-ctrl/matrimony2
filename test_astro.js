const { calculateTamilMatch } = require('./server/utils/astrologyMatcher');

const boy = {
    natchathiram: 'Magha',
    gender: 'male'
};

const girl = {
    natchathiram: 'Mrigashira',
    gender: 'female'
};

const result = calculateTamilMatch(boy, girl);
console.log(JSON.stringify(result, null, 2));
