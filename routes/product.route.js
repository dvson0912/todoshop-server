const express = require("express");
const controller = require("../controllers/product.controller");
const middlewareUser = require("../middleware/user.middleware");
const multer = require("multer");
const store = require("../storage");

const update = multer({ storage: store });

const router = express.Router();

router.post(
  "/create",
  middlewareUser.verifyUser,
  middlewareUser.verifyAdmin,
  update.fields([
    { name: "avatar", maxCount: 1 },
    { name: "color", maxCount: 8 },
    { name: "descriptionImg", maxCount: 8 },
  ]),
  controller.createProduct
);
router.post(
  "/delete",
  middlewareUser.verifyUser,
  middlewareUser.verifyAdmin,
  controller.deleteProduct
);
router.get("/search", controller.searchProduct);
router.get("/:link", controller.getProdctByLink);
router.get("/", controller.getPageProducts);

module.exports = router;
