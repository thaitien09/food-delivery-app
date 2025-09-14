import nguoidungModel from "../models/userModel.js"

const addToCart = async (req, res) => {
    try {
        let nguoidungData = await nguoidungModel.findOne({_id:req.userId});
        let giohangData = nguoidungData.giohangData;
        if(!giohangData[req.body.itemId]) {
            giohangData[req.body.itemId] = 1;
        } else {
            giohangData[req.body.itemId] += 1;
        }
        await nguoidungModel.findByIdAndUpdate(req.userId, {giohangData});
        res.json({ success: true, message: "Thêm vào giỏ hàng thành công" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Lỗi khi thêm vào giỏ hàng" });
    }
};

const removeFromCart = async (req, res) => {
    try {
        let nguoidungData = await nguoidungModel.findOne({_id:req.userId});
        let giohangData = nguoidungData.giohangData;
        if(giohangData[req.body.itemId]) {
            giohangData[req.body.itemId] -= 1;
            if(giohangData[req.body.itemId] <= 0) delete giohangData[req.body.itemId];
        }
        await nguoidungModel.findByIdAndUpdate(req.userId, {giohangData});
        res.json({ success: true, message: "Đã xóa khỏi giỏ hàng" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Lỗi khi xóa khỏi giỏ hàng" });
    }
};

const getCart = async (req, res) => {
    try {
        let nguoidungData = await nguoidungModel.findOne({_id:req.userId});
        res.json({ success: true, giohangData: nguoidungData.giohangData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Lỗi khi lấy giỏ hàng" });
    }
};

export { addToCart, removeFromCart, getCart }