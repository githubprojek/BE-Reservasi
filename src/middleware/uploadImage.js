// middleware/uploadImage.js
import multer from "multer";

const storage = multer.memoryStorage(); // Buffer only!
export const upload = multer({ storage });
