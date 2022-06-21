const CategoryModel = require("../models/category.model");
const TypeModel = require("../models/type.model");
const ProductModel = require("../models/product.model");

const createCategory = async (req, res) => {
  try {
    const dataCategory = req.body;
    const isHad = await CategoryModel.findOne({ name: dataCategory.name });
    if (isHad) {
      return res
        .status(400)
        .json({ sucess: false, message: "category này đã được tạo-- " });
    }
    const newCategory = new CategoryModel(dataCategory);
    await newCategory.save();
    return res.status(200).json({ data: newCategory });
  } catch (error) {
    return res.status(400).json({ message: "create error" });
  }
};

const getPageCategory = async (req, res) => {
  try {
    const page = !req.query.page ? 1 : req.query.page;
    CategoryModel.paginate(
      {},
      { offset: (page - 1) * 12, limit: 12, sort: { createdAt: "desc" } }
    ).then((result) => {
      return res.status(200).json({ data: result });
    });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

const getProductByLinkCategory = async (req, res) => {
  try {
    const page = !req.query.page ? 1 : req.query.page;
    const link = req.params.category;
    const category = await CategoryModel.findOne({ link });
    const typeOfCategory = await TypeModel.find({ category: category._id });

    ProductModel.paginate(
      { category: category._id },
      { offset: (page - 1) * 12, limit: 12, sort: { createdAt: "desc" } }
    )
      .then((result) => {
        return res.status(200).json({
          data: {
            ...result,
            typeOfCategory,
            category,
          },
        });
      })
      .catch((err) => {
        return res.status(400).json({ message: "error" });
      });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const categorys = await CategoryModel.find();
    return res.status(200).json({ data: categorys });
  } catch (error) {
    return res.status(500).json({ message: "Get category error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.body.id;
    if (id) {
      const category = await CategoryModel.findByIdAndDelete(id);
      return res.status(200).json({ sucess: true, data: category });
    }
    return res.status(400).json({ sucess: false, message: "ID wrong" });
  } catch (error) {
    return res.status(500).json({ sucess: false, message: "delete wrong" });
  }
};

module.exports.createCategory = createCategory;
module.exports.getPageCategory = getPageCategory;
module.exports.getAllCategory = getAllCategory;
module.exports.deleteCategory = deleteCategory;
module.exports.getProductByLinkCategory = getProductByLinkCategory;
