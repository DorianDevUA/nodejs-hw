import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    // Перевіряємо, чи починається mimetype з "image/"
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      // Повертаємо помилку "Only images allowed", як вимагає ТЗ
      cb(new Error('Only images allowed'), false);
    }
  },
});
