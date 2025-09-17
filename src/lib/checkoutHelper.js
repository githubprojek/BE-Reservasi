// lib/checkoutHelper.js
import Reservasi from "../models/reservasi.models.js";
import ReservasiHistory from "../models/history.reservasi.models.js";

export const archiveReservasi = async (reservasiId) => {
  const reservasi = await Reservasi.findById(reservasiId);
  if (!reservasi) throw new Error("Reservasi tidak ditemukan");

  const archived = new ReservasiHistory({
    guestName: reservasi.guestName,
    guestEmail: reservasi.guestEmail,
    guestPhone: reservasi.guestPhone,
    hotel: reservasi.hotel,
    room: reservasi.room,
    jumlahTamu: reservasi.jumlahTamu,
    jumlahKamar: reservasi.jumlahKamar,
    checkIn: reservasi.checkIn,
    checkOut: reservasi.checkOut,
    totalPrice: reservasi.totalPrice,
    paymentMethod: reservasi.paymentMethod,
    paymentStatus: reservasi.paymentStatus,
    statusReservasi: reservasi.statusReservasi,
    paidAt: reservasi.paidAt,
    keterangan: reservasi.keterangan,
    archivedAt: new Date(),
  });

  await archived.save();
  await reservasi.deleteOne();

  return archived._id;
};
