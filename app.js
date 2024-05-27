var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

// database connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const dev_db_url = `mongodb+srv://${process.env.MONGO_USR}:${process.env.MONGO_PW}@cluster0.x1ddt44.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const mongoDB = process.env.MONGODB_URI || dev_db_url;

// Rate limiter
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
let catalogRouter = require("./routes/catalog");
const { mainModule } = require("process");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);
app.use(limiter);

app.use("/", catalogRouter);
app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
