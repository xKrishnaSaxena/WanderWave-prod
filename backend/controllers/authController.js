const AppError = require("../utils/appError");
const User = require("./../model/userModel");
const jwt = require("jsonwebtoken");

const sendEmail = require("../utils/email");
const crypto = require("crypto");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) Check if email and password actually exists
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  //2)Check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //3)If everything ok,send token to the client

  createSendToken(user, 201, res);
});
//creating protected route
exports.protect = catchAsync(async (req, res, next) => {
  try {
    // 1) Getting the token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new AppError("You are not logged in", 401)); // 401 -> unauthorized
    }

    // 2) Validate the token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const freshUser = await User.findById(decodedData.id);
    if (!freshUser) {
      return next(
        new AppError("The user belonging to the token no longer exists", 401)
      );
    }

    // 4) Check if user changed password after the token was issued
    if (freshUser.changedPasswordAfter(decodedData.iat)) {
      return next(
        new AppError("User recently changed password! Please log in again", 401)
      );
    }

    // Grant access to the protected route
    req.user = freshUser;
    next();
  } catch (err) {
    return next(new AppError("Invalid token", 401));
  }
});

//forgot Password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on the request body email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with this email address", 404));
  }
  //2) Generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to : ${resetURL} \n If you didn't your password,please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10min)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = "";
    user.passwordResetExpires = "";
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

//reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2) if token has not expired,and there is user ,set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = "";
  user.passwordResetExpires = undefined;
  await user.save(); //to save the new information and run the validators also
  //3)Update changedPasswordAt property for the user

  //4)Log the user in,send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) Get the user from the collection
  const user = await User.findOne({ _id: req.user._id }).select("+password");
  //2) Check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Password is incorrect,Please try again!", 401));
  }
  //3)If so , update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //4) Log user in,send JWT
  createSendToken(user, 200, res);
});
