const express = require("express");
const cityRouter = require("./routes/cityRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const cors = require("cors");
const app = express();
app.use(cors());
const morgan = require("morgan");
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} //HTTPMethod URL statusCode timeItTook sizeOfRes(bytes) eg GET /api/v1/cities 200 3.842 ms - 1331

app.use(express.json()); //middleware that stands between request and response ( data from the body is added to it ) basically used to use req.body for the post request
//creating middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// app.get("/api/v1/cities", getAllCites);
// app.post("/api/v1/cities", createNewCity);
// app.get("/api/v1/cities/:id", getACity);
// app.patch("/api/v1/cities/:id", updateCity);
// app.delete("/api/v1/cities/:id", deleteCity);

//mounting the router
app.use("/api/v1/cities", cityRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
