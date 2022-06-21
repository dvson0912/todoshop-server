const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public/image");
  },
  filename: (req, file, cb) => {
    const dot = file.originalname.split(".");
    const fileName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + fileName + "." + dot[dot.length - 1]);
  },
});

module.exports = storage;
