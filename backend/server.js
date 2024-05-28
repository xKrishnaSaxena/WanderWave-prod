const mongoose = require("mongoose");

const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! SHUTTING DOWN...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" }); //reading the content of config.env file , it only only happens once and then is available for access anywhere in the code
const app = require("./app");
const PORT = process.env.PORT || 8000;
// const city = require("./models/cityModel");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB, {}).then(() => {
  console.log("DB connection successful!");
});

// console.log(process.env);
// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//put request method requires the whole new object that needs to be updated
//patch request method requrires the properties that needs to be changed
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
