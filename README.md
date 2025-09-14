# 🍕 Food Delivery App

Ứng dụng đặt đồ ăn trực tuyến với giao diện người dùng, panel quản trị và API backend.

## 📋 Tính năng

### Frontend (Người dùng)
- Đăng ký/Đăng nhập người dùng
- Duyệt menu món ăn
- Thêm món ăn vào giỏ hàng
- Đặt hàng và thanh toán
- Theo dõi đơn hàng
- Đánh giá món ăn

### Admin Panel
- Quản lý món ăn (thêm, sửa, xóa)
- Quản lý đơn hàng
- Quản lý người dùng
- Thống kê doanh thu
- Upload hình ảnh món ăn

### Backend API
- RESTful API với Express.js
- Xác thực JWT
- Kết nối MongoDB
- Upload file với Multer
- Tích hợp Stripe thanh toán

## 🛠️ Công nghệ sử dụng

### Frontend & Admin
- **React 19** - UI Framework
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Stripe** - Payment processing

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File upload
- **Bcrypt** - Password hashing

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js (v16 trở lên)
- MongoDB
- Git

### 1. Clone repository
```bash
git clone <repository-url>
cd food-delivery
```

### 2. Cài đặt Backend
```bash
cd backend
npm install
```

### 3. Cài đặt Frontend
```bash
cd ../frontend
npm install
```

### 4. Cài đặt Admin Panel
```bash
cd ../admin
npm install
```

### 5. Cấu hình môi trường

Tạo file `.env` trong thư mục `backend`:
```env
PORT=4000
DB_URI=mongodb://localhost:27017/food-delivery
JWT_SECRET=your-jwt-secret-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### 6. Chạy ứng dụng

**Backend:**
```bash
cd backend
npm run server
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Admin Panel:**
```bash
cd admin
npm run dev
```

## 📁 Cấu trúc dự án

```
food-delivery/
├── backend/           # API Server
│   ├── config/       # Database config
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Auth middleware
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   └── uploads/      # Uploaded files
├── frontend/         # User interface
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
├── admin/            # Admin panel
│   ├── src/
│   │   ├── components/
│   │   └── pages/
└── assets/           # Shared assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

### Food Management
- `GET /api/food/list` - Lấy danh sách món ăn
- `POST /api/food/add` - Thêm món ăn (Admin)
- `PUT /api/food/:id` - Cập nhật món ăn (Admin)
- `DELETE /api/food/:id` - Xóa món ăn (Admin)

### Orders
- `POST /api/order/add` - Tạo đơn hàng
- `GET /api/order/list` - Lấy danh sách đơn hàng
- `PUT /api/order/:id` - Cập nhật trạng thái đơn hàng

### Cart
- `POST /api/cart/add` - Thêm vào giỏ hàng
- `GET /api/cart/list` - Lấy giỏ hàng
- `DELETE /api/cart/:id` - Xóa khỏi giỏ hàng

## 👥 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng tạo issue trên GitHub.

---

⭐ Nếu dự án này hữu ích, hãy cho một star nhé!
