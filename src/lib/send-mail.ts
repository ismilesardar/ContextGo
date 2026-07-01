import nodemailer from 'nodemailer';
import { SendMail } from '@/types/utils';
import {
  APP_NAME,
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_SMTP_EMAIL
} from '@/config/url.config';
// 1. Import the specific SMTP Transport types
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const sendMail = async ({ subject, receiver, body }: SendMail) => {
  // 2. Define your options with the explicit type
  const mailConfig: SMTPTransport.Options = {
    host: MAIL_HOST,
    // 3. Ensure port is a number (crucial for TS)
    port: Number(MAIL_PORT),
    secure: false,
    auth: {
      user: MAIL_SMTP_EMAIL,
      pass: MAIL_PASSWORD
    }
  };

  const transporter = nodemailer.createTransport(mailConfig);

  const options = {
    from: `"${APP_NAME}" <${MAIL_SMTP_EMAIL}>`,
    to: receiver,
    subject: subject,
    html: body
  };

  try {
    const info = await transporter.sendMail(options);
    return { success: true, info };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to send email' };
  }
};
