
require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const cors=require('cors');
const dotenv = require("dotenv");
const { error } = require("./middleware/error");
const userRouter = require("./routes/userRouter");
const transactionRouter = require("./routes/transactionRouter");

const app = express();



dotenv.config();
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("> DB connection successful ! ");
  });
app.use(express.json());
app.use(cors());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/transaction", transactionRouter);

app.use(error);



app.listen(process.env.PORT||  8000,() => {
  console.log(`> Server running on port 8000`);
});
