const { PollyClient } = require("@aws-sdk/client-polly");
const dotenv = require("dotenv");
dotenv.config();
const pollyClient = new PollyClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
module.exports = { pollyClient };