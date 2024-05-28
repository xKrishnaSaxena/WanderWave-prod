const express = require("express");
const cityController = require("../controllers/cityController");
const cityRouter = express.Router();
const authController = require("../controllers/authController");

// cityRouter.param("id", cityController.checkID);

cityRouter
  .route("/")
  .get(authController.protect, cityController.getAllCites)
  .post(authController.protect, cityController.createNewCity);
cityRouter
  .route("/:id")
  .get(cityController.getACity)
  .patch(cityController.updateCity)
  .delete(authController.protect, cityController.deleteCity);

module.exports = cityRouter;
