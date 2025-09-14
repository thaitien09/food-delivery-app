import monanModel from "../models/foodModel.js";
import fs from 'fs'


//them mon an

const themMonan = async  (req,res) => {



    let image_filename= `${req.file.filename}`;

    const monan = new monanModel({
        ten: req.body.ten,
        mota: req.body.mota,
        gia: req.body.gia,
        danhmuc: req.body.danhmuc,
        image: image_filename  // Đổi từ "anh" thành "image"
    });
    
    try{
        await monan.save();
        res.json({success:true,message:"Món ăn đã được thêm"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"lỗi"})
    }

}

//hien danh sach
const listMonan = async (req,res) => {
    try {
        const monan = await monanModel.find({});
        res.json({success:true,data:monan})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Lỗi"})
    }
}

// xoa mon an
const xoaMonan = async (req, res) => {
    try {
        // Tìm món ăn theo id
        const monan = await monanModel.findById(req.body.id);

        if (!monan) {
            return res.json({ success: false, message: "Món ăn không tồn tại" });
        }

        // Xóa file ảnh nếu tồn tại
        fs.unlink(`uploads/${monan.image}`, (err) => {
            if (err) console.log("Lỗi xóa ảnh:", err);
        });

        // Xóa món ăn trong database
        await monanModel.findByIdAndDelete(req.body.id);

        res.json({ success: true, message: "Đã xóa món ăn" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi" });
    }
};

const suaMonan = async (req, res) => {
    try {
        const { ten, mota, gia, danhmuc } = req.body;

        // Tạo object update
        const updateData = { ten, mota, gia, danhmuc };

        // Nếu có upload ảnh mới, cập nhật
        if (req.file) {
            updateData.image = req.file.filename;

            // Xóa ảnh cũ nếu có
            const monanOld = await monanModel.findById(req.params.id);
            if (monanOld && monanOld.image) {
                fs.unlink(`uploads/${monanOld.image}`, (err) => {
                    if (err) console.log("Lỗi xóa ảnh cũ:", err);
                });
            }
        }

        // Cập nhật món ăn trong DB
        const updated = await monanModel.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updated) {
            return res.json({ success: false, message: "Món ăn không tồn tại" });
        }

        res.json({ success: true, message: "Món ăn đã được cập nhật", data: updated });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi cập nhật món ăn" });
    }
};

export {themMonan, listMonan,xoaMonan,suaMonan}