const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { now } = require("mongoose");

const createToken = (user, time, sign) => {
  return jwt.sign(
    {
      id: user._id,
      admin: user.admin,
    },
    sign,
    { expiresIn: time }
  );
};

const register = async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.body.userName });
    if (user) {
      return res.status(403).json({ message: "UserName wrong" });
    }
    const { password, ...other } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    const newUser = new User({
      ...other,
      password: hashPassword,
    });
    const responseUser = await newUser.save();
    return res.status(200).json(responseUser);
  } catch (error) {
    return res.status(500).json({ message: "Sever wrong" });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.body.userName });
    if (!user) {
      return res.status(404).json({ message: "UserName wrong" });
    }
    const isPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!isPassword) {
      return res.status(404).json({ message: "Password wrong" });
    }
    const timeAccessToken = req.body.check && !user.admin ? "30d" : "2h";
    const accessToken = createToken(
      user,
      timeAccessToken,
      process.env.JWT_ACCESS_KEY
    );
    const refreshToken = createToken(user, "365d", process.env.JWT_REFRESH_KEY);
    const newRefresh = new RefreshToken({ token: refreshToken });
    await newRefresh.save();
    const { password, ...other } = user._doc;
    return res
      .status(201)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      })
      .json({ data: { ...other, accessToken } });
  } catch (error) {
    return res.status(500).json({ message: "server wrong" });
  }
};

const updateInfoUser = async (req, res) => {
  try {
    const { password, admin, ...updateUser } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, {
      ...updateUser,
    });
    return res.status(200).json({ data: updateUser });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updatePasswordUser = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    console.log(currentPassword, newPassword);
    const user = await User.findById(req.user.id);
    const validPassword = bcrypt.compareSync(currentPassword, user.password);
    if (validPassword) {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(newPassword, salt);
      const { password, ...other } = user._doc;
      await User.findByIdAndUpdate(req.user.id, {
        ...other,
        password: hashPassword,
      });
      return res.status(200).json({ message: "Update password is successly" });
    } else {
      return res.status(404).json({ message: "Update password is wrong" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server Wrong" });
  }
};

const reLogin = async (req, res) => {
  try {
    const cookie = req.cookies.refreshToken;
    const user = await User.findById(req.user.id);
    const isRefreshToken = await RefreshToken.find({ token: cookie });
    if (user && isRefreshToken) {
      const { password, ...other } = user._doc;
      const accessToken = createToken(user, "30d", process.env.JWT_ACCESS_KEY);
      const refreshToken = createToken(
        user,
        "365d",
        process.env.JWT_REFRESH_KEY
      );
      await RefreshToken.findOneAndDelete({ token: cookie });
      const newRefresh = new RefreshToken({ token: refreshToken });
      await newRefresh.save();
      res.clearCookie("refreshToken");
      return res
        .status(201)
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          path: "/",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        })
        .json({ data: { ...other, accessToken } });
    } else {
      return res.status(404).json({ message: "token error" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const refresh = async (req, res) => {
  try {
    const refreshCookie = req.cookies && req.cookies.refreshToken;
    const refreshToken = await RefreshToken.findOneAndDelete({
      token: refreshCookie,
    });

    if (refreshToken && refreshToken.token) {
      jwt.verify(
        refreshToken.token,
        process.env.JWT_REFRESH_KEY,
        async (err, user) => {
          if (err) {
            return res.status(403).json({ message: "token not i valid" });
          }
          const newRefreshToken = createToken(
            user,
            "365d",
            process.env.JWT_REFRESH_KEY
          );
          const newAccessToken = createToken(
            user,
            "2h",
            process.env.JWT_ACCESS_KEY
          );

          const dataRefresh = new RefreshToken({ token: newRefreshToken });
          await dataRefresh.save();

          res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            sameSite: "strict",
          });
          return res.status(200).json(newAccessToken);
        }
      );
    } else {
      return res.status(404).json({ message: "token is not valid" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      res.clearCookie("refreshToken");
      await RefreshToken.findOneAndDelete({ token: refreshToken });
      return res.status(200).json({ message: "logout successly" });
    } else {
      return res.status(401).json({ message: "You're not is authentation" });
    }
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  register,
  login,
  updateInfoUser,
  updatePasswordUser,
  reLogin,
  refresh,
  logout,
};
