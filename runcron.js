require('dotenv').config();
const cronController = require('./controller/cronController');
async function runCron() {
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
}
runCron();