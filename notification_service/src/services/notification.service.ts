import * as nodemailer from 'nodemailer';

export class notificationService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // Configure your email transport here (SMTP, etc.)
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });
  }

  async sendEmail(payload) {
    let {to, subject, text} = payload
    try {
        await this.transporter.sendMail({
            from: 'your-email@gmail.com',
            to,
            subject,
            text,
        });
    } catch (error) {
        console.log(
            JSON.stringify({
              type: 'SERVER ERROR',
              error: error.message,
            }),
        );
    }
  }
}
