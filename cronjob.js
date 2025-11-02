const cron = require('node-cron');
require('dotenv').config();
const cronController = require('./controller/cronController');

// Schedule the cron job to run every hour 1 minute past the hour
cron.schedule('0 * * * *', async () => {
    console.log('Running cron job at', new Date().toISOString());
    try {
        // Simulate a request and response object
        const req = {};
        const res = {
            status: (code) => ({
                send: (message) => console.log(`Response: ${code} - ${message}`)
            })
        };
        await cronController.runCron(req, res);
    } catch (error) {
        console.error('Error executing cron job:', error);
    }
});