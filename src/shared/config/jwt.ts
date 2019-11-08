export default {
  defaultStrategy: process.env.JWT_STRATEGY,
  secretKey: process.env.JWT_SECRET_KEY,
  expiresIn: process.env.JWT_EXPIRES_IN,
};
