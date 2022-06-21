const express = require("express");
const controller = require("../controllers/category.controller");
const middlewareUser = require("../middleware/user.middleware");

const router = express.Router();

router.post(
  "/create",
  middlewareUser.verifyUser,
  middlewareUser.verifyAdmin,
  controller.createCategory
);

router.post(
  "/delete",
  middlewareUser.verifyUser,
  middlewareUser.verifyAdmin,
  controller.deleteCategory
);

router.get("/getall", controller.getAllCategory);

router.get("/:category", controller.getProductByLinkCategory);

router.get("/", controller.getPageCategory);

module.exports = router;
