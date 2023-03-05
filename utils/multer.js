const multer = require('multer');
const path = require('path');
const AppError = require('./appError');

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
   let ext = path.extname(file.originalname);
   if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
     cb(new AppError('File type is not supported', 415), false);
     return;
   }
   cb(null, true);
  },
});