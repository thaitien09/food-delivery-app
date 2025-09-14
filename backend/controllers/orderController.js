import donhangModel from "../models/orderModel.js";
import nguoidungModel from "../models/userModel.js";
import monanModel from "../models/foodModel.js";

// Tạo đơn hàng mới
const createOrder = async (req, res) => {
    try {
        const { hoten, sodienthoai, diachi, ghichu, giohangData, tongtien } = req.body;
        
        // Kiểm tra dữ liệu đầu vào
        if (!hoten || !sodienthoai || !diachi || !giohangData || !tongtien) {
            return res.status(400).json({ 
                success: false, 
                message: "Vui lòng điền đầy đủ thông tin" 
            });
        }

        // Tạo đơn hàng mới
        const newOrder = new donhangModel({
            userId: req.userId,
            hoten,
            sodienthoai,
            diachi,
            ghichu: ghichu || "",
            giohangData,
            tongtien,
            trangthai: "pending"
        });

        await newOrder.save();

        // Xóa giỏ hàng sau khi đặt hàng thành công
        await nguoidungModel.findByIdAndUpdate(req.userId, { giohangData: {} });

        res.status(201).json({ 
            success: true, 
            message: "Đặt hàng thành công", 
            orderId: newOrder._id 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi khi tạo đơn hàng" 
        });
    }
};

// Lấy danh sách đơn hàng của user
const getUserOrders = async (req, res) => {
    try {
        const orders = await donhangModel.find({ userId: req.userId })
            .sort({ ngaytao: -1 });

        // Lấy thông tin chi tiết sản phẩm cho mỗi đơn hàng
        const ordersWithProducts = await Promise.all(
            orders.map(async (order) => {
                const giohangData = order.giohangData;
                const productIds = Object.keys(giohangData);
                
                // Lấy thông tin sản phẩm
                const products = await Promise.all(
                    productIds.map(async (productId) => {
                        const product = await monanModel.findById(productId);
                        if (product) {
                            return {
                                ...product.toObject(),
                                quantity: giohangData[productId]
                            };
                        }
                        return null;
                    })
                );

                // Lọc bỏ các sản phẩm null
                const validProducts = products.filter(product => product !== null);

                return {
                    ...order.toObject(),
                    products: validProducts
                };
            })
        );

        res.json({ 
            success: true, 
            orders: ordersWithProducts 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi khi lấy danh sách đơn hàng" 
        });
    }
};

// Lấy chi tiết một đơn hàng
const getOrderDetail = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await donhangModel.findOne({ 
            _id: orderId, 
            userId: req.userId 
        });

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy đơn hàng" 
            });
        }

        // Lấy thông tin chi tiết sản phẩm
        const giohangData = order.giohangData;
        const productIds = Object.keys(giohangData);
        
        const products = await Promise.all(
            productIds.map(async (productId) => {
                const product = await monanModel.findById(productId);
                if (product) {
                    return {
                        ...product.toObject(),
                        quantity: giohangData[productId]
                    };
                }
                return null;
            })
        );

        // Lọc bỏ các sản phẩm null
        const validProducts = products.filter(product => product !== null);

        const orderWithProducts = {
            ...order.toObject(),
            products: validProducts
        };

        res.json({ 
            success: true, 
            order: orderWithProducts 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi khi lấy chi tiết đơn hàng" 
        });
    }
};

// Lấy tất cả đơn hàng cho admin
const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const skip = (page - 1) * limit;
        
        // Tạo filter
        let filter = {};
        if (status && status !== 'all') {
            filter.trangthai = status;
        }
        
        // Tìm kiếm theo tên, số điện thoại, hoặc ID đơn hàng
        if (search) {
            filter.$or = [
                { hoten: { $regex: search, $options: 'i' } },
                { sodienthoai: { $regex: search, $options: 'i' } },
                { _id: { $regex: search, $options: 'i' } }
            ];
        }

        const orders = await donhangModel.find(filter)
            .sort({ ngaytao: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Lấy thông tin chi tiết sản phẩm cho mỗi đơn hàng
        const ordersWithProducts = await Promise.all(
            orders.map(async (order) => {
                const giohangData = order.giohangData;
                const productIds = Object.keys(giohangData);
                
                const products = await Promise.all(
                    productIds.map(async (productId) => {
                        const product = await monanModel.findById(productId);
                        if (product) {
                            return {
                                ...product.toObject(),
                                quantity: giohangData[productId]
                            };
                        }
                        return null;
                    })
                );

                const validProducts = products.filter(product => product !== null);

                return {
                    ...order.toObject(),
                    products: validProducts
                };
            })
        );

        const total = await donhangModel.countDocuments(filter);

        res.json({ 
            success: true, 
            orders: ordersWithProducts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalOrders: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi khi lấy danh sách đơn hàng" 
        });
    }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ 
                success: false, 
                message: "Vui lòng cung cấp trạng thái mới" 
            });
        }

        const validStatuses = ['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: "Trạng thái không hợp lệ" 
            });
        }

        const order = await donhangModel.findByIdAndUpdate(
            orderId,
            { 
                trangthai: status,
                ngaycapnhat: new Date()
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy đơn hàng" 
            });
        }

        res.json({ 
            success: true, 
            message: "Cập nhật trạng thái đơn hàng thành công",
            order: order
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi khi cập nhật trạng thái đơn hàng" 
        });
    }
};

// Lấy thống kê đơn hàng
const getOrderStats = async (req, res) => {
    try {
        const stats = await donhangModel.aggregate([
            {
                $group: {
                    _id: '$trangthai',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$tongtien' }
                }
            }
        ]);

        const totalOrders = await donhangModel.countDocuments();
        const totalRevenue = await donhangModel.aggregate([
            {
                $match: { trangthai: { $in: ['delivered'] } }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$tongtien' }
                }
            }
        ]);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = await donhangModel.countDocuments({
            ngaytao: { $gte: today }
        });

        res.json({ 
            success: true, 
            stats: {
                byStatus: stats,
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                todayOrders
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi khi lấy thống kê đơn hàng" 
        });
    }
};

export { createOrder, getUserOrders, getOrderDetail, getAllOrders, updateOrderStatus, getOrderStats };
