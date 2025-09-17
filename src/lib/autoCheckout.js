// src/lib/autoCheckout.js
import cron from "node-cron";
import Reservasi from "../models/reservasi.models.js";
import { archiveReservasi } from "./checkoutHelper.js";

export const startAutoCheckout = () => {
  cron.schedule("0 */30 * * * *", async () => {
    const now = new Date();

    const expired = await Reservasi.find({
      checkOut: { $lt: now },
      statusReservasi: { $in: ["checked-in"] }, // hanya tamu yang belum checkout manual
    });

    for (const reservasi of expired) {
      try {
        reservasi.statusReservasi = "checked-out";
        await reservasi.save();

        await archiveReservasi(reservasi._id);

        console.log(`✅ Auto archived: ${reservasi._id}`);
      } catch (err) {
        console.error(err);
      }
    }
  });

  console.log("🔄 Auto checkout cron started.");
};
