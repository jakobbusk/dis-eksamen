const understoryController = require('./understoryController');
const notifyController = require('./notifyController');
const pinController = require('./pinController');

class cronController {

    static async runCron(req, res){
        const now = new Date();
        //set end og start til seneste heltime
        const end = new Date(now.setMinutes(0, 0, 0));
        const start = new Date(end.getTime() - 60 * 60 * 1000);
        try {
            const bookings = await understoryController.getBookings(start.toISOString(), end.toISOString());
            bookings.items.forEach(e => {
                const pincode = Math.floor(100000 + Math.random() * 900000).toString(); //generer 6-cifret pin
                Promise.all([notifyController.sendEmail(e.customer.email, e.event_id, pincode),
                    notifyController.sendSMS(e.customer.phone, e.event_id, pincode),
                    pinController.createPin(e.customer.email, e.event_id, pincode)])
            });
        } catch (error) {
            console.error("Error fetching bookings:", error);
            return res.status(500).send("Error fetching bookings");
        }
        res.status(200).send("Cron job executed successfully");
    }
}

module.exports = cronController;
