import express from "express"
import { dangnhapNguoidung,dangkyNguoidung,capNhatAvatar, listNguoidung } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js"
import multer from "multer"

const nguoidungRoute = express.Router()

// Cấu hình multer cho upload ảnh đại diện
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `avatar_${Date.now()}_${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload file ảnh'), false);
  }
};

const upload = multer({ storage: storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });

nguoidungRoute.post("/dangky",dangkyNguoidung)
nguoidungRoute.post("/dangnhap",dangnhapNguoidung)
nguoidungRoute.put("/avatar/:userId", upload.single("avatar"), capNhatAvatar)
nguoidungRoute.get("/list", listNguoidung)

export default nguoidungRoute;