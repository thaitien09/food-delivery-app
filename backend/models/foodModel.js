import mongoose from "mongoose";

// định nghĩa schema món ăn
const monanSchema = new mongoose.Schema({
    ten: { type: String, required: true },
    mota: { type: String, required: true },
    gia: { type: Number, required: true },
    image: { type: String, required: true },
    danhmuc: { type: String, required: true }
});

// tạo model món ăn
const monanModel = mongoose.models.monan || mongoose.model("monan", monanSchema);

export default monanModel;
