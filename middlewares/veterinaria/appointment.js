const multer = require("multer");
const path = require("path");

const ProfileStorage = multer.diskStorage({
  destination: "./public/appointment",
  filename: (req, file, cb) => {
    cb(
      null,
     file.originalname 
    );
  },
});

const profileFilter = function (req, file, cb) {
  if (
    (file.mimetype.startsWith("image/") &&
      (file.originalname.endsWith(".png") || file.originalname.endsWith(".jpg"))) ||
    (file.mimetype === "application/pdf" && file.originalname.endsWith(".pdf")) ||
    (file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      file.originalname.endsWith(".xlsx"))
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file format. Only PNG, JPG, PDF, and Excel (XLSX) files are allowed."
      )
    );
  }
};


const uploadDoc = multer({
  storage: ProfileStorage,
  limits: {
    fileSize: 10000000,
    files: 10, 
  },
  fileFilter: profileFilter,
})

module.exports = uploadDoc;
