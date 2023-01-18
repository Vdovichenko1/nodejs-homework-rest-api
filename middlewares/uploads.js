const multer = require("multer");

const uploads = multer({ dest: "tmp/" });

module.exports = uploads;
