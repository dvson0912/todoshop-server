const ProductModel = require("../models/product.model");
const CategoryModel = require("../models/category.model");
const TypeModel = require("../models/type.model");
require("dotenv").config();

const createProduct = async (req, res) => {
  try {
    const body = req.body;
    const avatar = "/image/" + req.files.avatar[0].filename;
    const color =
      req.files.color &&
      req.files.color.map((item) => {
        return "/image/" + item.filename;
      });

    const descriptionImg =
      req.files.descriptionImg &&
      req.files.descriptionImg.map((item) => {
        return "/image/" + item.filename;
      });

    const nameCategory =
      body.category && (await CategoryModel.findById(body.category));
    const nameType = body.type && (await TypeModel.findById(body.type));

    const dataProduct = new ProductModel({
      name: body.name,
      price: Number.parseInt(body.price),
      avatar,
      color,
      descriptionImg,
      link: body.link,
      category: body.category,
      type: body.type,
      nameCategory: nameCategory.name,
      nameType: nameType.name,
      size: body.size === "" || body.size === null ? [] : body.size.split(","),
    });
    await dataProduct.save();
    return res.status(200).redirect("http://localhost:3000/admin/products");
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getPageProducts = async (req, res) => {
  try {
    const page = !req.query.page ? 1 : req.query.page;
    ProductModel.paginate(
      {},
      { offset: (page - 1) * 12, limit: 12, sort: { createdAt: "desc" } }
    )
      .then((result) => {
        return res.status(200).json({ data: { ...result } });
      })
      .catch((err) => {
        return res.status(400).json({ message: "error" });
      });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.body.id;
    if (id) {
      const product = await ProductModel.findByIdAndDelete(id);
      return res.status(200).json({ data: product });
    }
    return res.status(400).json({ message: "id wrong" });
  } catch (error) {
    return res.status(500).json({ message: "delete error" });
  }
};

const getProdctByLink = async (req, res) => {
  try {
    const link = req.params.link;
    const product = await ProductModel.findOne({ link });
    const relatedProducts = await ProductModel.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(4)
      .sort({ createdAt: "desc" });
    if (product) {
      return res.status(200).json({
        data: { product, relatedProducts },
      });
    }
    return res.status(400).json({ message: "Không có sản phẩm" });
  } catch (error) {
    return res.status(400).json({ message: "err" });
  }
};

const searchProduct = async (req, res) => {
  try {
    const query = req.query.name.split("+");
    const products = await ProductModel.find({
      name: { $regex: query.join(" "), $options: "i" },
    })
      .sort({ createdAt: -1 })
      .limit(8);
    res.status(200).json({ data: { products } });
  } catch (error) {
    return res.status(500).json({ message: "Server wrong" });
  }
};

module.exports.createProduct = createProduct;
module.exports.deleteProduct = deleteProduct;
module.exports.getPageProducts = getPageProducts;
module.exports.getProdctByLink = getProdctByLink;
module.exports.searchProduct = searchProduct;
