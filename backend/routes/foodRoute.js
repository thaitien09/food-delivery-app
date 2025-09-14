import express from "express";
import { themMonan, listMonan, xoaMonan, suaMonan } from "../controllers/foodController.js";
import multer from "multer";

const MonanRouter = express.Router();

// cấu hình multer
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Route thêm món ăn
MonanRouter.post("/them", upload.single("image"), themMonan);

// Route lấy danh sách
MonanRouter.get("/list", listMonan);

// Route xóa món ăn
MonanRouter.post("/xoa", xoaMonan);

// Route sửa món ăn
MonanRouter.put("/sua/:id", upload.single("image"), suaMonan);

export default MonanRouter;
