const mongoose = require("mongoose");

// Creating the city model
const citySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  cityName: {
    type: String,
    required: [true, "City Name is required"],
  },
  country: {
    type: String,
    required: [true, "Country is required"],
  },
  emoji: {
    type: String,
  },
  date: {
    type: String,
    required: [true, "Date is required"],
  },
  notes: {
    type: String,
    default: "",
  },
  position: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Create a compound index to enforce uniqueness based on userId and cityName
citySchema.index({ userId: 1, cityName: 1 }, { unique: true });

const City = mongoose.model("City", citySchema);

module.exports = City;
