const jwt = require("jsonwebtoken");

const { jwtSecret } = require("../../config");

const userAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(403).json({
        message: "Missing / Invalid authization token",
      });
    }
    const words = authHeader.split(" ");
    const jwtToken = words[1];

    try {
      const decodedValue = jwt.verify(jwtToken, jwtSecret);
      const username = decodedValue.username;
      req.username = username;
      next();
    } catch (error) {
      return res.status(403).json({
        message: "User not authorised",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Oops something went wrong!",
    });
  }
};

module.exports = userAuthMiddleware;
