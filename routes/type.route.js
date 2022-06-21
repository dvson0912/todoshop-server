const express = require("express");
const controller = require("../controllers/type.controller");
const middlewareUser = require("../middleware/user.middleware");

const router = express.Router();

router.post(
  "/create",
  middlewareUser.verifyUser,
  middlewareUser.verifyAdmin,
  controller.createType
);

router.post(
  "/delete",
  middlewareUser.verifyUser,
  middlewareUser.verifyAdmin,
  controller.deleteType
);

router.get("/getall", controller.getAllType);

router.get("/:type", controller.getProductsByType);

router.get("/", controller.getPageType);

module.exports = router;
