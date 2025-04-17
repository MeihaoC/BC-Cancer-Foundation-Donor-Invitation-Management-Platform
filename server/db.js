require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs'); 

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("Connected to Aiven MySQL!");

module.exports = pool.promise();

module.exports.hashPassword = async (plainText) => {
  return await bcrypt.hash(plainText, 10);
};