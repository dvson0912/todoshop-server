const Order = require("../models/order.model");
const OrderDetails = require("../models/orderDetails.model");
const User = require("../models/user.model");

const controller = {
  addOrder: async (req, res) => {
    try {
      const data = req.body;
      const user = req.user;
      const quantity =
        Array.isArray(data.products) &&
        data.products.reduce((result, item) => {
          return result + item.quantity;
        }, 0);
      const newOrder = new Order({
        idUser: user.id,
        name: data.name,
        address: data.address,
        email: data.email,
        note: data.note || "",
        phone: data.phone,
        quantity,
        totalPrice: data.totalPriceOrder,
        status: "Đang Giao",
      });
      const products =
        data.products &&
        data.products.map(async (item, index) => {
          const orderDetails = new OrderDetails({
            idOrder: newOrder._id,
            idProduct: item._id,
            nameProduct: item.name,
            size: item.size || "",
            avatar: item.avatar,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
          });
          await orderDetails.save();
        });
      await newOrder.save();
      return res.status(200).json({ message: "order successfully" });
    } catch (error) {
      return res.status(500).json({ message: "server error" });
    }
  },

  getOrder: async (req, res) => {
    try {
      const user = req.user;
      const page = req.query.page || 1;
      if (user.admin) {
        Order.paginate(
          {},
          { offset: (page - 1) * 12, limit: 12, sort: { createdAt: "desc" } }
        )
          .then((result) => {
            return res.status(200).json({ data: result });
          })
          .catch((err) => {
            return res.status(400).json({ message: err });
          });
      } else {
        Order.paginate(
          { idUser: user.id },
          { offset: (page - 1) * 12, limit: 12, sort: { createdAt: "desc" } }
        )
          .then((result) => {
            return res.status(200).json({ data: result });
          })
          .catch((err) => {
            return res.status(400).json({ message: err });
          });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server wrong" });
    }
  },

  getOrderDetails: async (req, res) => {
    try {
      const user = req.user;
      const idOrder = req.query.id;
      const order = await Order.findById(idOrder);
      if (user.id === order.idUser.toString() || user.admin) {
        const orderDetails = await OrderDetails.find({ idOrder });
        return res.status(200).json({ data: { order, orderDetails } });
      } else {
        return res.status(400).json({ message: "You're not authorization" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server wrong" });
    }
  },

  undoOrder: async (req, res) => {
    try {
      const user = req.user;
      const idOrder = req.query.id || "";
      const order = await Order.findById(idOrder);
      if (user.id === order.idUser.toString()) {
        console.log(123);
        await Order.findByIdAndUpdate(idOrder, {
          status: "Đã Hủy",
        });
        return res.status(200).json({ message: "undo order successfully" });
      }
      return res.status(404).json({ message: "undo order Wrong" });
    } catch (error) {
      return res.status(500).json("server Wrong");
    }
  },
};

module.exports = controller;
