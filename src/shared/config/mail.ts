export default {
  smtp: {
    server: process.env.MAIL_SMTP_SERVER,
    port: process.env.MAIL_SMTP_PORT,
    secure: process.env.MAIL_SMTP_SECURE,
  },
  auth: {
    username: process.env.MAIL_AUTH_USERNAME,
    password: process.env.MAIL_AUTH_PASSWORD,
  },
  mailer: {
    from: process.env.MAIL_FROM_EMAIL_ADDRESS,
  },
};
