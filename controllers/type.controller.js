const TypeModel = require("../models/type.model");
const CategoryModel = require("../models/category.model");
const productModel = require("../models/product.model");

const createType = async (req, res) => {
  try {
    const dataType = req.body;
    const testTypeName = await TypeModel.findOne({ name: dataType.name });
    const testIdCategory =
      (await CategoryModel.findById(dataType.category)) || null;
    if (testIdCategory) {
      if (testTypeName) {
        return res
          .status(400)
          .json({ success: false, message: "Type này đã được tạo rồi" });
      }
      const newType = new TypeModel(dataType);
      await newType.save();
      return res.status(200).json({ success: true, data: newType });
    }
    return res.status(400).json({ success: false, message: "Category error1" });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Category error" });
  }
};

const getPageType = async (req, res) => {
  try {
    const page = !req.query.page ? 1 : req.query.page;
    TypeModel.paginate(
      {},
      { offset: (page - 1) * 12, limit: 12, sort: { createdAt: "desc" } }
    )
      .then((result) => {
        return res.status(200).json({ data: result });
      })
      .catch((err) => {
        return res.status(400).json({ message: "error" });
      });
  } catch (error) {
    return res.status(400).json({ message: "get type error" });
  }
};

const getAllType = async (req, res) => {
  try {
    const types = await TypeModel.find();
    return res.status(200).json({ data: types });
  } catch (error) {
    return res.status(200).json({ message: "Get type error" });
  }
};

const deleteType = async (req, res) => {
  try {
    const id = req.body.id;
    if (id) {
      const type = await TypeModel.findByIdAndDelete(id);
      return res.status(200).json({ message: "Delete success", data: type });
    }
    return res.status(500).json({ message: "ID wrong" });
  } catch (error) {
    return res.status(500).json({ message: "Delete wrong" });
  }
};

const getProductsByType = async (req, res) => {
  try {
    const page = !req.query.page ? 1 : req.query.page;
    const link = !req.params.type ? "" : req.params.type;
    const type = await TypeModel.findOne({ link: link });
    productModel
      .paginate(
        { type: type._id },
        { offset: (page - 1) * 12, limit: 12, sort: { createdAt: "desc" } }
      )
      .then((result) => {
        return res.status(200).json({ data: { type, ...result } });
      })
      .catch((err) => res.status(400).json({ message: err }));
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports.createType = createType;
module.exports.getAllType = getAllType;
module.exports.getPageType = getPageType;
module.exports.deleteType = deleteType;
module.exports.getProductsByType = getProductsByType;
