const understoryController = require('./understoryController');
const notifyController = require('./notifyController');

class cronController {

    static async runCron(req, res){
        let bookings;
        try {
            bookings = await understoryController.getBookings(new Date(Date.now() - 60*60*1000).toISOString(), new Date().toISOString());
        } catch (error) {
            console.error("Error fetching bookings:", error);
            return res.status(500).send("Error fetching bookings");
        }
        bookings.items.forEach(e => {
            notifyController.sendEmail(e.customer.email, e.event_id);
            notifyController.sendSMS(e.customer.phone, e.event_id);
        });
        res.status(200).send("Cron job executed successfully");
    }
}

module.exports = cronController;
