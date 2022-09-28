require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const bodyParser = require("body-parser");

const dotenv = require("dotenv");
const { error } = require("./middleware/error");
const userRouter = require("./routes/userRouter");
const transactionRouter = require("./routes/transactionRouter");
require("./config/passport.setup");

const app = express();
dotenv.config();

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("> DB connection successful ! ");
  });

app.use("/tolopayprofiles", express.static("tolopayprofiles"));

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/v1/users", userRouter);

app.use("/api/v1/transaction", transactionRouter);

app.use(error);

app.listen(process.env.PORT || 8000,() =>{
  console.log(`> Server running on port 8000`);
});
