const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";
const sgMail = require('@sendgrid/mail');


class NotifyController {
    static async sendNotification(req, res) {
        // Implementation for sending SMS and email notifications
        const { mobile, email, eventid } = req.body;


        try {
            await Promise.all([NotifyController.sendSMS(mobile, eventid), NotifyController.sendEmail(email, eventid)]);

            res.status(200).json({ success: true, message: 'Notification sent successfully' });
        } catch (error) {
            console.error('Error sending notification:', error);
            res.status(500).json({ success: false, message: 'Failed to send notification' });
        }
    }

    static async sendSMS(to, eventid) {


    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;
    const client = twilio(accountSid, authToken);

    async function createMessage() {
    const message = await client.messages.create({
        body: `Hej fra Understory!\nTak for din tilmelding til eventet med id: ${eventid}. Du kan bruge følgende link, til at uploade dine billeder efter eventet: http://dis.sbusk.dev/upload/${eventid} \nVi glæder os til at se dine billeder!`,
        from: fromPhone,
        to: to,
        from: "ReLive"
    });

    console.log(message.body);
    }
    await createMessage();
    }

    static async sendEmail(email, eventid) {
        // Implementation for sending email notifications
        const subject = `Tilmelding til event med id: ${eventid}`;
        const body = `Hej fra Understory!\nTak for din tilmelding til eventet med id: ${eventid}. Du kan bruge følgende link, til at uploade dine billeder efter eventet: http://dis.sbusk.dev/upload/${eventid} \nVi glæder os til at se dine billeder!`;

        // Twilio SendGrid

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: 'no-reply@dis.sbusk.dev',
            subject: subject,
            text: body,
        };
        await sgMail.send(msg);
    }
}

module.exports = NotifyController;