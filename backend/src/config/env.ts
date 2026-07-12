import dotenv from 'dotenv';

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI:
    process.env.MONGODB_URI ||
    'mongodb+srv://trisetyogaluh_db_user:7s9pgeuQUCTCW1dL@tr.bwvut50.mongodb.net/news-portal',
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-change-this',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};

export default env;
