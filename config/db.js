import "dotenv/config";

module.exports = {
  database:
    "mongodb://annie1:anniepass1@ds217809.mlab.com:17809/blackice",
  secret: process.env.SECRET_KEY
};
