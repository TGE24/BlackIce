import "dotenv/config";

module.exports = {
  database:
    "mongodb://TGE:1some2thing@ds217809.mlab.com:17809/blackice",
  secret: process.env.SECRET_KEY
};
