require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const passport = require("passport");

const dotenv = require("dotenv");
const { error } = require("./middleware/error");
const userRouter = require("./routes/userRouter");
const notificationRouter = require("./routes/notificationRouter");
const transactionRouter = require("./routes/transactionRouter");
const recurrenttransactionRouter = require("./routes/recurrenttransactionRouter");
const keys = require("./config/keys");
require("./config/passport.setup");
require("./server");

const app = express();
dotenv.config();

app.use(
  expressSession({
    secret: keys.session.cookieKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("> DB connection successful ! ");
  });

app.use("/tolopayprofiles", express.static("tolopayprofiles"));

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/v1/users", userRouter);

app.use("/api/v1/transaction", transactionRouter);
app.use("/api/v1/transaction", transactionRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/recurrenttransaction", recurrenttransactionRouter);

app.use(error);

app.listen(process.env.PORT || 8000, () => {
  console.log(`> Server running on port 8000`);
});
