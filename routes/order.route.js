const router = require("express").Router();
const controller = require("../controllers/order.controller");
const middleware = require("../middleware/user.middleware");

router.post("/add-order", middleware.verifyUser, controller.addOrder);

router.get("/get-order", middleware.verifyUser, controller.getOrder);
router.get(
  "/get-orderdetails",
  middleware.verifyUser,
  controller.getOrderDetails
);
router.post("/undo-order", middleware.verifyUser, controller.undoOrder);

module.exports = router;
