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
            body: `Hej fra ReLive x Understory!\nTak for din tilmelding til eventet med id: ${eventid}.\n\nDu kan bruge følgende link, til at uploade dine billeder efter eventet: http://dis.sbusk.dev/upload/${eventid} \n\nSe billeder her: http://dis.sbusk.dev/pictures/${eventid}\n\nVi glæder os til at se dine billeder!`,
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
        const body = `Hej fra ReLive x Understory!\nTak for din tilmelding til eventet med id: ${eventid}.\nDu kan bruge følgende link, til at uploade dine billeder efter eventet: http://dis.sbusk.dev/upload/${eventid} \n\nSe billeder her: http://dis.sbusk.dev/pictures/${eventid}\n\nVi glæder os til at se dine billeder!`;
        const generatedMail = emailHtml.replaceAll("%%eventid%%", eventid);

        // Twilio SendGrid

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: 'no-reply@dis.sbusk.dev',
            subject: subject,
            text: body,
            html: generatedMail,
        };
        await sgMail.send(msg);
    }
}

module.exports = NotifyController;


const emailHtml = `<!doctype html>
<html lang="da">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Tak for din tilmelding</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: rgb(2, 44, 17);
      font-family: -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: rgb(237, 248, 134);
    }
    .email-wrapper {
      width: 100%;
      background-color: rgb(2, 44, 17);
      padding: 20px 0;
    }
    .email-content {
      max-width: 600px;
      margin: 0 auto;
      background: rgb(2, 44, 17);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(237, 248, 134, 0.3);
    }
    .header {
      padding: 24px;
      text-align: center;
      background: rgb(2, 44, 17);
    }
    .header img {
      max-width: 160px;
      height: auto;
      margin-bottom: 12px;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      line-height: 1.2;
      color: rgb(237, 248, 134);
    }
    .body {
      padding: 24px;
      font-size: 16px;
      line-height: 1.5;
      color: rgb(237, 248, 134);
    }
    a {
      color: rgb(237, 248, 134);
      text-decoration: underline;
    }
    .button {
      display: inline-block;
      padding: 12px 20px;
      margin: 10px 8px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      background: rgb(237, 248, 134);
      color: rgb(2, 44, 17);
    }
    .footer {
      padding: 16px 24px;
      text-align: center;
      font-size: 13px;
      color: rgb(237, 248, 134);
      opacity: 0.8;
    }
    @media screen and (max-width:480px) {
      .body { padding: 18px; font-size: 15px; }
      .header { padding: 18px; }
      .button { display:block; margin:10px auto; }
    }
  </style>
</head>
<body>
  <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center">
        <table class="email-content" width="600" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td class="header">
              <img src="https://res.cloudinary.com/diseksamen/image/upload/v1762247788/event_pictures/6a1afe10abd8717b8d6a864a873d910b/fucamcuswdckensicup9.png" alt="Understory logo">
              <h1>Hej fra ReLive x Understory!</h1>
            </td>
          </tr>

          <tr>
            <td class="body">
              <p>Tak for din tilmelding til eventet med id: <strong>%%eventid%%</strong>.</p>

              <p>Efter eventet kan du bruge linkene herunder til at uploade dine billeder og se de billeder, der allerede er blevet delt:</p>

              <p style="text-align:center;">
                <a class="button" href="http://dis.sbusk.dev/upload/%%eventid%%" target="_blank">
                  Upload dine billeder
                </a>
                <a class="button" href="http://dis.sbusk.dev/pictures/%%eventid%%" target="_blank">
                  Se billederne
                </a>
              </p>

              <p>Eller brug disse links:<br>
                <p>Upload:</p><a href="http://dis.sbusk.dev/upload/%%eventid%%" target="_blank">
                  http://dis.sbusk.dev/upload/%%eventid%%
                </a><br>
                <p>Se billeder:</p><a href="http://dis.sbusk.dev/pictures/%%eventid%%" target="_blank">
                  http://dis.sbusk.dev/pictures/%%eventid%%
                </a>
              </p>

              <p><strong>Vi glæder os til at se dine billeder!</strong></p>

              <p>De bedste hilsner,<br><strong>Teamet hos Understory</strong></p>
            </td>
          </tr>

          <tr>
            <td class="footer">
              ReLive • Sea of Tranquillity <br>
              Hvis du ikke ønskede denne mail, kan du ignorere den.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;