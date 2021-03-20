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
            from: `"Time Ataux" <${process.env.EMAIL}>`,
            to: email,
            subject: title,
            text: body,
        };
    }

    sendCodeToResetPassword(email: string, code: string) {
        const title = 'Recuperação de Senha';
        const body = `
        Você pode resetar sua senha nesse link:
        
        ${process.env.FRONTEND_URL}/recoverPassword/${code}

        Time Ataux.
        `;

        this.transporter.sendMail(this.mailOptions(email, body, title));
    }

    sendEmailConfirmation(email: string, code: string) {
        const title = 'Confirmação de email';
        const body = `
        Por favor, clique nesse link para confirmar seu email.
        
        ${process.env.FRONTEND_URL}/confirm/${code}

        Time Ataux.
        `;

        this.transporter.sendMail(this.mailOptions(email, body, title));
    }
}
