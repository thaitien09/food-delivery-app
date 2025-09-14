import React, { useContext, useState, useEffect } from 'react'
import './Donhang.css'
import { noidung } from '../../context/noidung'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const Donhang = () => {
  const { url } = useContext(noidung)
  const navigate = useNavigate()
  const location = useLocation()
  
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedOrder, setExpandedOrder] = useState(null)

  // Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/user`, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      
      if (response.data.success) {
        console.log('Orders data:', response.data.orders)
        setOrders(response.data.orders)
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error)
      setError('Không thể tải danh sách đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  // Format ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Lấy tên trạng thái
  const getStatusName = (status) => {
    const statusMap = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      preparing: 'Đang chuẩn bị',
      delivering: 'Đang giao hàng',
      delivered: 'Đã giao hàng',
      cancelled: 'Đã hủy'
    }
    return statusMap[status] || status
  }

  // Lấy icon trạng thái
  const getStatusIcon = (status) => {
    const iconMap = {
      pending: '⏳',
      confirmed: '✅',
      preparing: '👨‍🍳',
      delivering: '🚚',
      delivered: '📦',
      cancelled: '❌'
    }
    return iconMap[status] || '❓'
  }

  // Lấy màu trạng thái
  const getStatusColor = (status) => {
    const colorMap = {
      pending: '#ffa500',
      confirmed: '#28a745',
      preparing: '#17a2b8',
      delivering: '#007bff',
      delivered: '#6f42c1',
      cancelled: '#dc3545'
    }
    return colorMap[status] || '#6c757d'
  }

  // Toggle hiển thị chi tiết đơn hàng
  const toggleOrderDetail = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  useEffect(() => {
    fetchOrders()
    
    // Hiển thị thông báo từ trang đặt hàng
    if (location.state?.message) {
      alert(location.state.message)
    }
  }, [location.state])

  if (loading) {
    return (
      <div className='donhang-page'>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='donhang-page'>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Không thể tải đơn hàng</h3>
          <p>{error}</p>
          <button onClick={fetchOrders} className="retry-btn">Thử lại</button>
        </div>
      </div>
    )
  }

  return (
    <div className='donhang-page'>
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Đơn hàng của tôi</h1>
          <p>Quản lý và theo dõi đơn hàng của bạn</p>
        </div>
        <button onClick={() => navigate('/')} className="continue-shopping-btn">
          Tiếp tục mua sắm
        </button>
      </div>

      {/* Content */}
      <div className="page-content">
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h2>Chưa có đơn hàng nào</h2>
            <p>Hãy bắt đầu mua sắm và tạo đơn hàng đầu tiên của bạn!</p>
            <button onClick={() => navigate('/')} className="start-shopping-btn">
              Bắt đầu mua sắm
            </button>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                {/* Card Header */}
                <div className="card-header">
                  <div className="order-id">
                    <span className="order-number">Đơn hàng #{order._id.slice(-8)}</span>
                    <span className="order-date">Ngày đặt: {formatDate(order.ngaytao)}</span>
                  </div>
                  <div className="status-indicator">
                    <span className="status-text">{getStatusName(order.trangthai)}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  {/* Products Section */}
                  {console.log('Order products:', order.products)}
                  {order.products && order.products.length > 0 && (
                    <div className="products-section">
                      <h4>Sản phẩm đã đặt:</h4>
                      <div className="products-list">
                        {order.products.slice(0, 3).map((product, index) => (
                          <div key={index} className="product-item">
                            <img 
                              src={`${url}/uploads/${product.image}`} 
                              alt={product.ten}
                              className="product-image"
                            />
                            <div className="product-info">
                              <span className="product-name">{product.ten}</span>
                              <span className="product-quantity">x{product.quantity}</span>
                            </div>
                            <span className="product-price">${product.gia}</span>
                          </div>
                        ))}
                        {order.products.length > 3 && (
                          <div className="more-products">
                            +{order.products.length - 3} sản phẩm khác
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="customer-info">
                    <div className="info-item">
                      <span className="info-label">Người nhận:</span>
                      <span className="info-value">{order.hoten}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">SĐT:</span>
                      <span className="info-value">{order.sodienthoai}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Địa chỉ:</span>
                      <span className="info-value">{order.diachi}</span>
                    </div>
                    {order.ghichu && (
                      <div className="info-item">
                        <span className="info-label">Ghi chú:</span>
                        <span className="info-value">{order.ghichu}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="card-footer">
                  <div className="total-amount">
                    <span className="amount-label">Tổng tiền:</span>
                    <span className="amount-value">${order.tongtien}</span>
                  </div>
                  <button 
                    className="view-detail-btn"
                    onClick={() => toggleOrderDetail(order._id)}
                  >
                    {expandedOrder === order._id ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                  </button>
                </div>

                {/* Expanded Order Detail */}
                {expandedOrder === order._id && (
                  <div className="order-detail-expanded">
                    <div className="detail-header">
                      <h3>Chi tiết đơn hàng #{order._id.slice(-8)}</h3>
                      <div 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.trangthai) }}
                      >
                        <span className="status-icon">{getStatusIcon(order.trangthai)}</span>
                        <span className="status-text">{getStatusName(order.trangthai)}</span>
                      </div>
                    </div>

                    <div className="detail-content">
                      {/* Order Info */}
                      <div className="detail-section">
                        <h4>Thông tin đơn hàng</h4>
                        <div className="info-grid">
                          <div className="info-item">
                            <span className="info-label">Mã đơn hàng:</span>
                            <span className="info-value">#{order._id.slice(-8)}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Ngày đặt:</span>
                            <span className="info-value">{formatDate(order.ngaytao)}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Ngày cập nhật:</span>
                            <span className="info-value">{formatDate(order.ngaycapnhat)}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Tổng tiền:</span>
                            <span className="info-value total-price">${order.tongtien}</span>
                          </div>
                        </div>
                      </div>

                      {/* All Products */}
                      <div className="detail-section">
                        <h4>Tất cả sản phẩm ({order.products?.length || 0})</h4>
                        {order.products && order.products.length > 0 ? (
                          <div className="all-products-list">
                            {order.products.map((product, index) => (
                              <div key={index} className="detail-product-item">
                                <img 
                                  src={`${url}/uploads/${product.image}`} 
                                  alt={product.ten}
                                  className="detail-product-image"
                                />
                                <div className="detail-product-info">
                                  <h5 className="detail-product-name">{product.ten}</h5>
                                  <p className="detail-product-description">{product.mota}</p>
                                  <div className="detail-product-meta">
                                    <span className="detail-product-category">{product.danhmuc}</span>
                                    <span className="detail-product-quantity">Số lượng: {product.quantity}</span>
                                  </div>
                                </div>
                                <div className="detail-product-price">
                                  <span className="detail-product-unit-price">${product.gia}</span>
                                  <span className="detail-product-total-price">
                                    ${(product.gia * product.quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="no-products">Không có sản phẩm nào trong đơn hàng này.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Donhang
