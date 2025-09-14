
import mongoose from "mongoose";

// Tao Schema cho nguoi dung
const nguoidungSchema = new mongoose.Schema({
  ten: { type: String, required: true },           // Ten nguoi dung
  email: { type: String, required: true, unique: true }, // Email, khong duoc trung
  matkhau: { type: String, required: true },       // Mat khau
  avatar: { type: String, default: "" },            // Anh dai dien, mac dinh rong
  giohangData:{type:Object, default:{}}
}, { minimize: false });

// Tao Model, neu da co thi dung lai
const nguoidungModel = mongoose.models.nguoidung || mongoose.model("nguoidung", nguoidungSchema);

export default nguoidungModel;