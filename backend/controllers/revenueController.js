import donhangModel from "../models/orderModel.js";
import monanModel from "../models/foodModel.js";

// Lấy thống kê doanh thu và lợi nhuận
const getRevenueStats = async (req, res) => {
    try {
        const { startDate, endDate, period } = req.query;
        
        // Xây dựng filter theo thời gian
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                ngaytao: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        } else if (period) {
            const now = new Date();
            let startDate;
            
            switch (period) {
                case 'today':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    break;
                case 'year':
                    startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                    break;
                default:
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
            }
            
            dateFilter = {
                ngaytao: { $gte: startDate }
            };
        }

        // Lấy đơn hàng đã giao hàng
        const deliveredOrders = await donhangModel.find({
            trangthai: 'delivered',
            ...dateFilter
        });

        // Tính toán doanh thu
        const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.tongtien, 0);
        
        // Tính toán chi phí (giả sử chi phí = 60% doanh thu)
        const totalCost = totalRevenue * 0.6;
        
        // Tính lợi nhuận
        const totalProfit = totalRevenue - totalCost;
        
        // Thống kê theo ngày
        const dailyStats = await donhangModel.aggregate([
            {
                $match: {
                    trangthai: 'delivered',
                    ...dateFilter
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$ngaytao"
                        }
                    },
                    revenue: { $sum: "$tongtien" },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        // Thống kê theo danh mục sản phẩm
        const categoryStats = await donhangModel.aggregate([
            {
                $match: {
                    trangthai: 'delivered',
                    ...dateFilter
                }
            },
            {
                $addFields: {
                    giohangArray: {
                        $objectToArray: "$giohangData"
                    }
                }
            },
            {
                $unwind: "$giohangArray"
            },
            {
                $lookup: {
                    from: "monans",
                    localField: "giohangArray.k",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $group: {
                    _id: "$product.danhmuc",
                    revenue: { $sum: { $multiply: ["$product.gia", "$giohangArray.v"] } },
                    quantity: { $sum: "$giohangArray.v" }
                }
            },
            {
                $sort: { revenue: -1 }
            }
        ]);

        // Thống kê top sản phẩm bán chạy
        const topProducts = await donhangModel.aggregate([
            {
                $match: {
                    trangthai: 'delivered',
                    ...dateFilter
                }
            },
            {
                $addFields: {
                    giohangArray: {
                        $objectToArray: "$giohangData"
                    }
                }
            },
            {
                $unwind: "$giohangArray"
            },
            {
                $lookup: {
                    from: "monans",
                    localField: "giohangArray.k",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $group: {
                    _id: {
                        productId: "$product._id",
                        productName: "$product.ten",
                        productPrice: "$product.gia"
                    },
                    totalQuantity: { $sum: "$giohangArray.v" },
                    totalRevenue: { $sum: { $multiply: ["$product.gia", "$giohangArray.v"] } }
                }
            },
            {
                $sort: { totalQuantity: -1 }
            },
            {
                $limit: 10
            }
        ]);

        // Thống kê theo tháng
        const monthlyStats = await donhangModel.aggregate([
            {
                $match: {
                    trangthai: 'delivered',
                    ...dateFilter
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$ngaytao"
                        }
                    },
                    revenue: { $sum: "$tongtien" },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        res.json({
            success: true,
            stats: {
                totalRevenue,
                totalCost,
                totalProfit,
                profitMargin: totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : 0,
                orderCount: deliveredOrders.length,
                dailyStats,
                monthlyStats,
                categoryStats,
                topProducts
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy thống kê doanh thu"
        });
    }
};

// Lấy chi tiết doanh thu theo khoảng thời gian
const getRevenueDetails = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp ngày bắt đầu và kết thúc"
            });
        }

        const orders = await donhangModel.find({
            trangthai: 'delivered',
            ngaytao: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ ngaytao: -1 });

        const totalRevenue = orders.reduce((sum, order) => sum + order.tongtien, 0);
        const totalCost = totalRevenue * 0.6;
        const totalProfit = totalRevenue - totalCost;

        res.json({
            success: true,
            data: {
                orders,
                summary: {
                    totalRevenue,
                    totalCost,
                    totalProfit,
                    profitMargin: totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : 0,
                    orderCount: orders.length
                }
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy chi tiết doanh thu"
        });
    }
};

export { getRevenueStats, getRevenueDetails };
