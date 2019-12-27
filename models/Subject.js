const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    ownedUser: {
        type: String,
        required: true
    }
});

const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = Subject;