/*
I use dotenv package to take environmental items form process.env
 */
require('dotenv').config();

module.exports = {
  dburl: process.env.DBURL,
  sessionKey: process.env.SESSION_KEY,
  port: process.env.PORT,
};
