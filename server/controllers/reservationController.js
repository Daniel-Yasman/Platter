const { DateTime, Interval } = require("luxon");
const Reservation = require("../models/Reservation");
const Slot = require("../models/Slot");
const Food = require("../models/Food");
const mongoose = require("mongoose");

// Pretty obvious, table limits + closing and opening hours limitors
const TABLE_LIMIT = 2;
const OPEN_HOUR = 9;
const CLOSE_HOUR = 21;

async function createReservation(req, res) {
  // session = do a process, if anything throws at all you reverse everything and cancel.
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId } = req.params;
    const { date, cart, total } = req.body;

    if (!date || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "missing_fields" });
    }
    // This section uses the Luxon date-time library
    // set timezone, output (date) is an ISO format
    const dt = DateTime.fromISO(date, { zone: "Asia/Jerusalem" });
    if (!dt.isValid) return res.status(400).json({ error: "invalid_date" });

    // Date limiter, simple, but makes it so that users cannot order more than a week forward, prevents funny dates like 2099.
    const now = DateTime.now();
    const max = now.plus({ weeks: 1 });
    const range = Interval.fromDateTimes(now, max);
    const isWithinLimit = range.contains(dt);

    if (!isWithinLimit)
      return res.status(409).json({ error: "invalid_date_time" });

    // the minute dot notation must either be 0 or 30
    if (![0, 30].includes(dt.minute))
      return res.status(409).json({ error: "invalid_minutes" });
    // simple hour check
    if (dt.hour < OPEN_HOUR || dt.hour >= CLOSE_HOUR)
      return res.status(409).json({ error: "invalid_hour" });

    // sets the format of the slot model string to the mentioned below
    const slotKey = dt.toFormat("yyyy-LL-dd'T'HH:mm");

    /*
    This command does the following:
  • Checks if 'used' is less than TABLE_LIMIT
  • If true (or document does not exist), increments 'used' by 1
  • On insert, sets 'limit' of the current TABLE_LIMIT and 'slotKey'
  • upsert = update if exists, insert if not
  • new = return the updated document
  • session = include this operation in the session transaction
    */
    const doc = await Slot.findOneAndUpdate(
      { slotKey, used: { $lt: TABLE_LIMIT } },
      { $inc: { used: 1 }, $setOnInsert: { limit: TABLE_LIMIT, slotKey } },
      { upsert: true, new: true, session }
    );
    if (!doc) throw new Error("slot_full");

    // decrement all the items in the cart's stock accordingly
    for (const item of cart) {
      // Try and find foodId of the food in cart
      const foodId = new mongoose.Types.ObjectId(item.foodId._id);
      /*
      This command does the following:
      • Checks if the foodId's stock >= item.quantity (that's in the cart)
      • remove stock of item by -x.quantity
      • session = include this operation in the session transaction
      */
      const updated = await Food.updateOne(
        { _id: foodId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session }
      );
      // If nothing was modified, then nothing got updated, usually an error
      if (updated.modifiedCount === 0) throw new Error("stock_error");
    }

    /* 
    Create reservation using dt.toJSDate() as the time field,
    which converts the Luxon DateTime into a native JS Date
    */
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
      // important session inclusion
      { session }
    );
    // If the whole thing runs smoothly (no throws, crashes) then it saves the changes
    await session.commitTransaction();
    // reservation[0]._id = reservations ObjectId
    return res
      .status(201)
      .json({ message: "reservation_created", id: reservation[0]._id });
  } catch (err) {
    /*
    If we catch, then we abort the session, any changes we made
    are reversed and aborted, making this whole sequence an atomic one
    */
    await session.abortTransaction();
    return res.status(500).json({ error: err.message || "server_error" });
  } finally {
    // Regardless if it passed or failed we must end the session anyway.
    session.endSession();
  }
}

async function userDeleteReservation(req, res) {
  try {
    // we delete via the users id (who deletes?) and the reservation id (what thing?)
    const { userId, reservationId } = req.params;
    if (!userId) return res.status(400).json({ error: "missing_fields" });

    const doc = await Reservation.findById(reservationId)
      .populate("cart.foodId")
      .populate("time");
    if (!doc) return res.status(404).json({ error: "not_found" });

    const now = Date.now();
    const when = new Date(doc.time).getTime();
    const H24 = 24 * 60 * 60 * 1000;

    /*
    if the doc time - the time it is now is < 24 hours
    and if they're not 0
    */
    if (when - now < H24 && when - now > 0)
      return res.status(409).json({ error: "time_passed" });

    // add stock back in
    const slotKey = doc.time;

    await Slot.findOneAndUpdate({ slotKey }, { $inc: { used: -1 } });

    for (const item of doc.cart) {
      const foodId = new mongoose.Types.ObjectId(item.foodId._id);

      const updated = await Food.updateOne(
        { _id: foodId, stock: { $gte: item.quantity } },
        { $inc: { stock: +item.quantity } }
      );
      if (updated.modifiedCount === 0) throw new Error("stock_error");
    }

    await Reservation.findOneAndDelete({ _id: reservationId });
    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}

async function listAllReservations(req, res) {
  try {
    const reservations = await Reservation.find({})
      .populate("cart.foodId", "name price image")
      .populate("userId", "name email");
    return res.status(200).json({ reservations });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}

async function listUserReservations(req, res) {
  try {
    const { userId } = req.params;
    const reservations = await Reservation.find({ userId }).populate(
      "cart.foodId",
      "name price image"
    );
    return res.status(200).json({ reservations });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}
module.exports = {
  createReservation,
  userDeleteReservation,
  listAllReservations,
  listUserReservations,
};
