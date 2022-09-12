const express = require("express");

app = express();

const PORT = process.env.PORT || 8000;

app.listen(8000, () => {
  console.log(`> Server running on ${PORT}`);
});
