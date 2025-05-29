// utils/email.js
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({to, subject, text, html}) => {
    await sgMail.send({to, from: process.env.EMAIL_FROM, subject, text, html});
};
