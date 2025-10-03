const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    if (req.baseUrl.includes('gallery')) uploadPath += 'gallery/';
    else if (req.baseUrl.includes('location')) uploadPath += 'location/';
    else if (req.baseUrl.includes('ground')) uploadPath += 'ground/';
    else if (req.baseUrl.includes('vehicle')) uploadPath += 'vehicle/';
    else if (req.baseUrl.includes('rafting')) uploadPath += 'rafting/';
    else if (req.baseUrl.includes('event')) uploadPath += 'event/';
    else uploadPath += 'general/';

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;