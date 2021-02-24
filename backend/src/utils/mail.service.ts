import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailService {
    private transporter: Mail;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
    }

    private mailOptions(email, body, title) {
        return {
            from: `"Team Ataux" <${process.env.EMAIL}>`,
            to: email,
            subject: title,
            text: body,
        };
    }

    sendCodeToResetPassword(email: string, code: string) {
        const title = 'Recover Password';
        const body = `
        You can reset your password at this link:
        
        ${process.env.FRONTEND_URL}/resetPassword/${code}

        Team Ataux.
        `;

        this.transporter.sendMail(this.mailOptions(email, body, title));
    }
}
