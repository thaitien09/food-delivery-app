import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

  // Nếu là token tạm thời cho admin, cho phép truy cập
  if (token === 'admin-temp-token') {
    req.userId = 'admin-temp-user';
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

export default authMiddleware;
