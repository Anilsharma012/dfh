const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { adminAuth } = require("../middleware/authMiddleware");

// 🛠 Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // uploads folder
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});

// 🔒 File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    console.log("✅ File type allowed:", file.originalname);
    return cb(null, true);
  } else {
    console.log("❌ File type rejected:", file.originalname, file.mimetype);
    return cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp, svg)"));
  }
};

// 📦 Multer middleware with validation
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// 📤 Upload route - protected with admin authentication
router.post("/", adminAuth, (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    // Handle multer errors (file type, size, etc.)
    if (err instanceof multer.MulterError) {
      console.log("❌ Multer error:", err.message);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          success: false, 
          message: "File is too large. Maximum size is 5MB" 
        });
      }
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    } else if (err) {
      // Handle custom errors (like file type validation)
      console.log("❌ Upload error:", err.message);
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Generate dynamic URL based on request
    const protocol = req.protocol;
    const host = req.get('host');
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    
    console.log("📤 File uploaded by:", req.user?.email || req.user?.id);
    console.log("📁 File name:", req.file.filename);
    console.log("📊 File size:", (req.file.size / 1024).toFixed(2), "KB");
    console.log("🔗 File URL:", fileUrl);
    
    return res.status(200).json({ success: true, url: fileUrl });
  });
});

module.exports = router;
