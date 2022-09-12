require("dotenv").config({ path: ".env" });
const express = require("express");
const mongoose = require("mongoose");

const userRouter = require("./routes/userRouter");

app = express();

app.use(express.json());

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("> DB connection successful ! ");
  });

app.use("/api/v1/users", userRouter);

const PORT = process.env.PORT || 8000;
app.listen(8000, () => {
  console.log(`> Server running on ${PORT}`);
});
