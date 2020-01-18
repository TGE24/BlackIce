import createError from "http-errors";
import express from "express";
import path from "path";
import logger from "morgan";
import routes from "./routes";
import config from "../config/db";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import User from "../src/models/userModel";
import jwt from "jsonwebtoken";
import session from "express-session";

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SECRET_KEY,
    maxAge: Date.now() + 30 * 86400 * 1000
  })
);

app.use(async (req, res, next) => {
  if (req.session.token) {
    const accessToken = req.session.token;
    const { userId, exp } = await jwt.verify(
      accessToken,
      process.env.JWT_SECRET
    );
    // Check if token has expired
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({
        error:
          "JWT token has expired, please login to obtain a new one"
      });
    }
    res.locals.loggedInUser = await User.findById(userId);
    next();
  } else {
    next();
  }
});

app.use("/", routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render("error");
});

// connect to db
mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set("useFindAndModify", false);

mongoose.connection.once("open", () => {
  console.log("Database Connection Successful");
});

export default app;
