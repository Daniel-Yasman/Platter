const { DateTime } = require("luxon");
const Reservation = require("../models/Reservation");
const Slot = require("../models/Slot");
const Food = require("../models/Food");
const mongoose = require("mongoose");

const TABLE_LIMIT = 2;
const OPEN_HOUR = 9;
const CLOSE_HOUR = 21;

async function createReservation(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId } = req.params;
    const { date, cart, total } = req.body;

    if (!date || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "missing_fields" });
    }

    const dt = DateTime.fromISO(date, { zone: "Asia/Jerusalem" });
    if (!dt.isValid) return res.status(400).json({ error: "invalid_date" });
    if (![0, 30].includes(dt.minute))
      return res.status(409).json({ error: "invalid_minutes" });
    if (dt.hour < OPEN_HOUR || dt.hour >= CLOSE_HOUR)
      return res.status(409).json({ error: "invalid_hour" });

    const slotKey = dt.toFormat("yyyy-LL-dd'T'HH:mm");

    // update slot
    const doc = await Slot.findOneAndUpdate(
      { slotKey, used: { $lt: TABLE_LIMIT } },
      { $inc: { used: 1 }, $setOnInsert: { limit: TABLE_LIMIT, slotKey } },
      { upsert: true, new: true, session }
    );
    if (!doc) throw new Error("slot_full");

    // decrement stock
    for (const item of cart) {
      const foodId = new mongoose.Types.ObjectId(item.foodId._id);
      const updated = await Food.updateOne(
        { _id: foodId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session }
      );

      if (updated.modifiedCount === 0) throw new Error("stock_error");
    }

    const reservation = await Reservation.create(
      [
        {
          userId,
          time: dt.toJSDate(),
          slotKey,
          cart,
          total,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    return res
      .status(201)
      .json({ message: "reservation_created", id: reservation[0]._id });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ error: err.message || "server_error" });
  } finally {
    session.endSession();
  }
}

async function userDeleteReservation(req, res) {
  try {
    const { userId, reservationId } = req.params;
    if (!userId) return res.status(400).json({ error: "missing_fields" });

    const doc = await Reservation.findOne({ _id: reservationId });
    if (!doc) return res.status(404).json({ error: "not_found" });

    const now = Date.now();
    const when = new Date(doc.time).getTime();
    const H24 = 24 * 60 * 60 * 1000;

    if (when - now < H24 && when - now > 0)
      return res.status(409).json({ error: "time_passed" });

    await Reservation.findOneAndDelete({ _id: reservationId });
    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}
async function listReservations(req, res) {
  try {
    const { userId } = req.params;
    const reservations = await Reservation.find({ userId: userId }).populate(
      "cart.foodId",
      "name price image"
    );
    console.log(reservations);
    return res.status(200).json({ reservations });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}
module.exports = { createReservation, userDeleteReservation, listReservations };
