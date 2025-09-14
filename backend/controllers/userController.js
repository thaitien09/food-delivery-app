import nguoidungModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator"

// dang nhap user
const dangnhapNguoidung = async (req, res) => {
  const {email,matkhau} = req.body;
  try {
    const nguoidung = await nguoidungModel.findOne({email});

    if(!nguoidung) {
        return res.json({success:false,message:"Người dùng không hợp lệ"})
    }
    const isMatch = await bcrypt.compare(matkhau, nguoidung.matkhau);
        
    if (!isMatch) {
        return res.json({success:false,message:"Mật khẩu không đúng"})
    }

    const token = taoToken(nguoidung._id)
    res.json({success:true,token})
    
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Lỗi"})
  }
}

const taoToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// dang ky user
const dangkyNguoidung = async (req, res) => {
  const {ten,matkhau,email} = req.body;
  try{
    // kiem tra 
    const exists = await nguoidungModel.findOne({email});
    if(exists) {
        return res.json({success:false,message:"Đã có người sử dụng"})
    }
    // kiểm tra email và độ mạnh mật khẩu
    if(!validator.isEmail(email)) {
        return res.json({success:false,message:"Vui lòng nhập email hợp lệ"})
    }

    if(matkhau.length<8) {
        return res.json({success:false,message:"Vui lòng nhập mật khẩu ít nhất 8 ký tự"})
    }

    // ma hoa
    const salt = await bcrypt.genSalt(10)
    const hashedMatkhau = await bcrypt.hash(matkhau,salt);

    const newNguoidung = new nguoidungModel({
        ten:ten,
        email:email,
        matkhau:hashedMatkhau
    })

   const nguoidung = await newNguoidung.save()
   const token = taoToken(nguoidung._id);
   res.json({success:true,token});
  } catch (error){
    console.log(error);
    res.json({success:false,message:"Lỗi"})
  }
}

// cap nhat anh dai dien
const capNhatAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
    const avatarFilename = req.file ? req.file.filename : null;

    if (!avatarFilename) {
      return res.json({ success: false, message: "Không có file ảnh được upload" });
    }

    // Cập nhật avatar trong database
    const updatedUser = await nguoidungModel.findByIdAndUpdate(
      userId,
      { avatar: avatarFilename },
      { new: true }
    );

    if (!updatedUser) {
      return res.json({ success: false, message: "Người dùng không tồn tại" });
    }

    res.json({ 
      success: true, 
      message: "Cập nhật ảnh đại diện thành công",
      avatar: avatarFilename 
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Lỗi khi cập nhật ảnh đại diện" });
  }
};

// lay danh sach nguoi dung (admin)
const listNguoidung = async (req, res) => {
  try {
    const users = await nguoidungModel.find({}, { matkhau: 0 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Lỗi khi lấy danh sách người dùng" });
  }
}

export { dangnhapNguoidung, dangkyNguoidung, capNhatAvatar, listNguoidung };