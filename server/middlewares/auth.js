const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.header("Authorization")?.replace(
        "Bearer ",
        ""
      );

    if (!token) {
      return res.status(401).json({
        message: "Token Missing",
      });
    }

    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decode;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
};