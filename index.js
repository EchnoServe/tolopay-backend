require("dotenv").config({ path: ".env" });
require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");

const userRouter = require("./routes/userRouter");
const transactionRouter = require("./routes/transactionRouter");

app = express();

app.use(express.json());

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("> DB connection successful ! ");
  });

app.use("/api/v1/users", userRouter);
app.use("/api/v1/transaction", transactionRouter);

app.use((err, req, res, next) => {
  //check status code
  res.status(404).json({
    message: err.message,
  });
});

const PORT = process.env.PORT || 8000;
app.listen(8000, () => {
  console.log(`> Server running on ${PORT}`);
});
