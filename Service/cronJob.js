// services/cronJobs.js
const cron = require('node-cron');
const InvalidatedToken = require('../models/invalidatedToken.model.js');

// Schedule a job to run every hour
cron.schedule('0 * * * *', async () => {
    try {
        // Delete expired tokens
        const result = await InvalidatedToken.deleteMany({ expiresAt: { $lt: new Date() } });
        console.log(`Cleaned up expired tokens: ${result.deletedCount} tokens removed`);
    } catch (error) {
        console.error("Error cleaning up expired tokens:", error);
    }
});
