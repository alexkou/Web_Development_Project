const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HarSchema = new Schema ({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    timestamp: {
        type: Date,
        default: Date.now
    },

    userIsp: {
        type: String
    },

    userIp: {
        type: String
    },

    data: {
        date: Date,
        ip: String,
        timing: Number,
        method: String,
        url: String,
        status: String,
        statusText: String,
        content_type: String,
        cache_control: String,
        pragma: String,
        expires: String,
        age: String,
        last_modified: String,
        Host: String,
    }
});

module.exports = mongoose.model('Har', HarSchema);


