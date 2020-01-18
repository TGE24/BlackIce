import 'dotenv/config'

module.exports = {
  database: "mongodb://localhost/"+ process.env.DB_NAME ,
  secret: process.env.SECRET_KEY
};
