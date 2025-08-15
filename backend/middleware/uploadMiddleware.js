import multer from 'multer';

// Use memory storage to allow for processing the file before saving it to disk.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // We'll accept images and videos.
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    // Reject other file types.
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // Set a file size limit (e.g., 100MB)
});

export default upload;
