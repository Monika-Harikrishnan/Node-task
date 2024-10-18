const mongoose = require('mongoose');

const InvalidatedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true, 
    },
    invalidatedAt: {
        type: Date,
        default: Date.now, 
    }
}, {
    timestamps: true, 
});

const InvalidatedToken = mongoose.model('InvalidatedToken', InvalidatedTokenSchema);

module.exports = InvalidatedToken;
