const express = require("express");
const { protect } = require("../middleware/protect");
const notificationController = require("./../controllers/notificationController");

const router = express.Router();

router.get("/", protect, notificationController.notification);

module.exports = router;
