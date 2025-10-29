const mongoose = require("mongoose");
// simple helper to connect to mongoose
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongoose Connected");
  } catch (err) {
    console.error(err);
    // important, if this throws it force exits the whole project
    process.exit(1);
  }
}
module.exports = connectDB;
