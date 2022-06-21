const router = require("express").Router();

const middlewareUser = require("../middleware/user.middleware");

const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/re-login", middlewareUser.verifyUser, authController.reLogin);

router.post("/logout", authController.logout);

router.post("/refresh", authController.refresh);

router.post(
  "/update-info",
  middlewareUser.verifyUser,
  authController.updateInfoUser
);

router.post(
  "/update-password",
  middlewareUser.verifyUser,
  authController.updatePasswordUser
);

module.exports = router;
