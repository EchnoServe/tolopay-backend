const Notification = require("./../models/notification");

exports.notification = async (req, res, next) => {
  const notifications = await Notification.find({
    user: req.user.id,
    read: false,
  });

  for await (const notification of notifications) {
    notification.read = true;

    await notification.save();
  }

  res.status(200).json({
    status: "OK",
    data: {
      notifications,
    },
  });
};
