const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    uni: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    darkMode: {
        type: Boolean,
        default: 0
    },
    planVer: {
        type: Number,
        default: '0'
    },
    stripeCusId: {
        type: String,
        default: ''
    },
    stripeSubId: {
        type: String,
        default: ''
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;