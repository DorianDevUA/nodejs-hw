import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
  // костиль
  tls: {
    rejectUnauthorized: false, // Игнорировать ошибки сертификатов
  },
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
