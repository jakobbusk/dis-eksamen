const understoryController = require('./understoryController');
const notifyController = require('./notifyController');

class cronController {

    static async runCron(req, res){
        const now = new Date();
        const end = new Date(now.setMinutes(0, 0, 0));
        const start = new Date(end.getTime() - 60 * 60 * 1000);
        try {
            const bookings = await understoryController.getBookings(start.toISOString(), end.toISOString());
            bookings.items.forEach(e => {
                Promise.all([notifyController.sendEmail(e.customer.email, e.event_id), notifyController.sendSMS(e.customer.phone, e.event_id)])
            });
        } catch (error) {
            console.error("Error fetching bookings:", error);
            return res.status(500).send("Error fetching bookings");
        }
        res.status(200).send("Cron job executed successfully");
    }
}

module.exports = cronController;
