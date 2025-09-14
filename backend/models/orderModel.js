import mongoose from "mongoose";

// Định nghĩa schema đơn hàng
const donhangSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },           // ID người dùng từ auth middleware
    hoten: { type: String, required: true },            // Họ và tên
    sodienthoai: { type: String, required: true },      // Số điện thoại
    diachi: { type: String, required: true },           // Địa chỉ
    ghichu: { type: String, default: "" },              // Ghi chú, mặc định rỗng
    giohangData: { type: Object, required: true },      // Dữ liệu giỏ hàng từ user
    tongtien: { type: Number, required: true },         // Tổng tiền đơn hàng
    trangthai: { 
        type: String, 
        enum: ["pending", "confirmed", "preparing", "delivering", "delivered", "cancelled"],
        default: "pending" 
    },                                                  // Trạng thái đơn hàng
    ngaytao: { type: Date, default: Date.now },         // Ngày tạo đơn hàng
    ngaycapnhat: { type: Date, default: Date.now }      // Ngày cập nhật cuối
});

// Tạo model đơn hàng
const donhangModel = mongoose.models.donhang || mongoose.model("donhang", donhangSchema);

export default donhangModel;
