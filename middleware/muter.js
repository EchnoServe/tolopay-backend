const multer = require("multer");
multer({ dest: "tolopayprofiles" });

// TODO:filter size type

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tolopayprofiles/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
