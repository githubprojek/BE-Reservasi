import midtransClient from "midtrans-client";
import dotenv from "dotenv";
dotenv.config();

export const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});
