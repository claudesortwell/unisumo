const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    docName: {
        type: String,
        required: true
    },
    docText: {
        type: String,
        required: true
    },
    ownedBy: {
        type: String,
        required: true
    },
    createdOn :{
        type: Date,
        default: Date.now
    },
    sharedWith: {
        type: String,
        required: false
    }
});

const Document = mongoose.model('Document', DocumentSchema);

module.exports = Document;