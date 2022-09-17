const jwt = require("jsonwebtoken");
const User = require("./../models/user");

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new Error("unauthorization"));
  }
  //2
  let decoded;
  jwt.verify(token, process.env.SECRET_KEY, (err, dec) => {
    decoded = { ...dec };
    if (err) {
      return next(err);
    }
  });
  //3
  const user = await User.findById(decoded.id).select("+password");
  if (!user) {
    return next(new Error("The user does not exist"));
  }

  //4TODO: check if a use change a password after the token is created

  req.user = user;

  next();
};
