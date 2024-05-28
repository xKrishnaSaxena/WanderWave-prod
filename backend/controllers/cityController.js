const { default: mongoose } = require("mongoose");
const City = require("./../model/CityModel");
const catchAsync = require("../utils/catchAsync");

// exports.checkID = (req, res, next, val) => {
//   if (req.params.id * 1 > cities.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid Id",
//     });
//   }
//   next();
// };

// exports.checkCityData = (req, res, next) => {
//   if (!req.body.cityName || !req.body.country) {
//     return res.status(400).json({
//       status: "fail",
//       message: "City name or country name missing",
//     });
//   }
//   next();
// };

// Define city route handlers here
exports.getAllCites = catchAsync(async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "User not authenticated",
      });
    }
    const cities = await City.find({ userId: req.user._id });
    res.status(200).json({
      status: "success",
      results: cities.length,
      data: {
        cities,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
});

exports.createNewCity = catchAsync(async (req, res) => {
  try {
    // Set the user field to the _id of the logged-in user
    req.body.userId = req.user._id;
    console.log(req.body);
    // Create the new city
    const newCity = await City.create({
      _id: new mongoose.Types.ObjectId(),
      userId: req.body.userId,
      cityName: req.body.cityName,
      notes: req.body.notes,
      country: req.body.country,
      emoji: req.body.emoji,
      date: req.body.date,
      position: req.body.position,
    });
    console.log(newCity._id);
    // Send success response with the new city data
    res.status(201).json({
      status: "success",
      data: {
        city: newCity,
      },
    });
  } catch (err) {
    // Send error response with the error message
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

exports.getACity = catchAsync(async (req, res) => {
  console.log(req.params); //to look at the url params
  // const city = cities.find((el) => el.id === id);
  try {
    const id = req.params.id;
    const city = await City.findById(id);
    res.status(200).json({
      status: "success",
      data: {
        city,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
});

exports.updateCity = catchAsync(async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: { city },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
});

exports.deleteCity = catchAsync(async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
});
