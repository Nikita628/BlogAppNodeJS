import multer from "multer";
import crypto from 'crypto';

export function fileStorage() {
  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, crypto.randomUUID() + "-" + file.originalname);
    },
  });
  return multer({ storage: fileStorage }).single("image");
}
