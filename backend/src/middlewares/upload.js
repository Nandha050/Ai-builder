const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    cb(null, `${Date.now()}-${name}${ext}`);
  }
});

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ".pdf",
    ".txt",
    ".docx",
    ".csv",
    ".png",
    ".jpg",
    ".jpeg"
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedTypes.includes(ext)) {
    return cb(
      new Error("Unsupported file type. Upload PDF, DOCX, TXT, CSV, or images"),
      false
    );
  }

  cb(null, true);
};

// Multer instance
const upload = multer({storage:
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

module.exports = upload;
