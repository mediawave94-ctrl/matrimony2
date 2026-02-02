const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    targetGender: { type: String, enum: ['male', 'female', 'both'] },

    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    subscriptionStatus: { type: String, enum: ['free', 'premium', 'elite'], default: 'free' },
    subscriptionExpiresAt: { type: Date },

    // Personality Profile (from Questionnaire)
    personality: {
        conflictHandling: { type: String },
        lifestyle: { type: String },
        careerVsFamily: { type: String },
        financialMindset: { type: String },
    },

    // Extended Profile
    bio: { type: String }, // Profile description

    // 1. Basic Details
    basicDetails: {
        photoUrl: { type: String },
        dob: { type: Date },
        maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Awaiting Divorce'] },
        physicalStatus: { type: String, enum: ['Normal', 'Physically Challenged'] },
        height: { type: Number }, // in cm? or feet? Storing as String or Number. Let's say Number (cm) for now or String for flexibility
        weight: { type: Number }, // in kg
        bodyType: { type: String, enum: ['Slim', 'Athletic', 'Average', 'Heavy'] },
        complexion: { type: String, enum: ['Fair', 'Very Fair', 'Wheatish', 'Dark'] },
        languagesKnown: [{ type: String }],
        hobbies: [{ type: String }],
        habits: {
            drinking: { type: String, enum: ['No', 'Occasionally', 'Regularly'] },
            smoking: { type: String, enum: ['No', 'Occasionally', 'Regularly'] },
            eating: { type: String, enum: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian'] }
        }
    },

    // 2. Religious Details
    religious: {
        religion: { type: String },
        caste: { type: String },
        subCaste: { type: String },
        gothiram: { type: String },
        kulam: { type: String },
        kulladheivam: { type: String } // Also in Family? Put here as per user listing style or keep flexible.
    },

    // 3. Professional Details
    professional: {
        education: { type: String }, // e.g. B.E, MBA
        educationDetails: { type: String },
        occupation: { type: String },
        occupationDetails: { type: String },
        employedIn: { type: String, enum: ['Private', 'Government', 'Business', 'Self Employed'] }, // Organization details loosely
        annualIncome: { type: String } // e.g. "5-10 LPA"
    },

    // 4. Location Details
    location: {
        country: { type: String },
        state: { type: String },
        city: { type: String },
        citizenship: { type: String },
        residingState: { type: String } // if different
    },

    // 5. Family Details
    family: {
        fatherName: { type: String },
        fatherOccupation: { type: String },
        motherName: { type: String },
        motherOccupation: { type: String },
        siblings: { type: String }, // e.g. "2 Sisters, 1 Brother"
        familyStatus: { type: String, enum: ['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent'] },
        familyType: { type: String, enum: ['Joint', 'Nuclear'] },
        familyValues: { type: String, enum: ['Orthodox', 'Traditional', 'Moderate', 'Liberal'] },
        familyOrigin: { type: String }, // Native
        familyLocation: { type: String }, // Current location
        aboutFamily: { type: String }
    },

    // 6. Astrological Details
    astrological: {
        rassi: { type: String },
        natchathiram: { type: String },
        dosham: { type: String, default: 'No' },
        jathagamUrl: { type: String } // File upload path
    },

    // Calculated Score (Compatibility DNA)
    compatibilityDNA: {
        emotional: { type: Number, default: 0 },
        thinking: { type: Number, default: 0 },
        lifestyle: { type: Number, default: 0 }
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
