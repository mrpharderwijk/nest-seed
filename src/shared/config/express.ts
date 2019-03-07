export default {
  environment: process.env.ENVIRONMENT,
  port: process.env.PORT,

  isProduction() {
    return this.get('express.environment') === 'production';
  },
};
