const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'file'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    action: {
        type: String,
        required: true,
        enum: ['shared', 'downloaded','updated']
    },
    IpAddress: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
})

const accessLog = mongoose.models.log || mongoose.model('log', accessLogSchema);

module.exports = { accessLog }
