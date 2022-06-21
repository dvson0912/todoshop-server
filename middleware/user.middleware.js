const jwt = require("jsonwebtoken");

const verifyUser = async (req, res, next) => {
  try {
    const accessToken = req.headers.token;
    if (!accessToken) {
      return res.status(401).json({ message: 'You"re not authenticated' });
    }
    const token = accessToken.split(" ")[1];
    jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        return res.status(404).json({ message: "token is not valid" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const user = req.user || {};
    if (!user.admin) {
      return res.status(403).json({ message: "You're is not Admin" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ ...error });
  }
};

module.exports = {
  verifyUser,
  verifyAdmin,
};
