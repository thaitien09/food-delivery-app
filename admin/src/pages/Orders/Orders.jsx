import React, { useState, useEffect } from 'react'
import './Orders.css'
import axios from 'axios'

const Orders = () => {
  const url = "http://localhost:4000"
  
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: 'all',
    search: ''
  })
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(null)

  // Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          params.append(key, filters[key])
        }
      })

      const response = await axios.get(`${url}/api/order/admin/all?${params}`, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      
      if (response.data.success) {
        setOrders(response.data.orders)
        setPagination(response.data.pagination)
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error)
      setError('Không thể tải danh sách đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  // Lấy thống kê
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${url}/api/order/admin/stats`, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      
      if (response.data.success) {
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Lỗi khi lấy thống kê:', error)
    }
  }

  // Cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId)
      const response = await axios.put(`${url}/api/order/admin/update-status/${orderId}`, {
        status: newStatus
      }, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      
      if (response.data.success) {
        // Cập nhật lại danh sách đơn hàng
        await fetchOrders()
        await fetchStats()
        alert('Cập nhật trạng thái thành công!')
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error)
      alert('Lỗi khi cập nhật trạng thái đơn hàng')
    } finally {
      setUpdatingStatus(null)
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

  // Xử lý thay đổi filter
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset về trang 1 khi thay đổi filter khác
    }))
  }

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault()
    fetchOrders()
  }

  useEffect(() => {
    fetchOrders()
    fetchStats()
  }, [filters.page, filters.status])

  if (loading && orders.length === 0) {
    return (
      <div className='orders-page'>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải đơn hàng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='orders-page'>
      {/* Header */}
      <div className="page-header">
        <h1>Quản lý đơn hàng</h1>
        <p>Tổng quan và quản lý tất cả đơn hàng</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="me-3">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-box text-primary fs-4"></i>
                </div>
              </div>
              <div>
                <h3 className="card-title mb-1 text-dark">{stats.totalOrders || 0}</h3>
                <p className="card-text text-muted mb-0">Tổng đơn hàng</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="me-3">
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-currency-dollar text-success fs-4"></i>
                </div>
              </div>
              <div>
                <h3 className="card-title mb-1 text-dark">${(stats.totalRevenue || 0).toLocaleString()}</h3>
                <p className="card-text text-muted mb-0">Doanh thu</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="me-3">
                <div className="bg-info bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-calendar-day text-info fs-4"></i>
                </div>
              </div>
              <div>
                <h3 className="card-title mb-1 text-dark">{stats.todayOrders || 0}</h3>
                <p className="card-text text-muted mb-0">Đơn hôm nay</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="me-3">
                <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-clock text-warning fs-4"></i>
                </div>
              </div>
              <div>
                <h3 className="card-title mb-1 text-dark">{stats.byStatus?.find(s => s._id === 'pending')?.count || 0}</h3>
                <p className="card-text text-muted mb-0">Chờ xử lý</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, SĐT, hoặc mã đơn hàng..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Tìm kiếm</button>
        </form>
        
        <div className="filter-controls">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="status-filter"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="preparing">Đang chuẩn bị</option>
            <option value="delivering">Đang giao hàng</option>
            <option value="delivered">Đã giao hàng</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          
          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            className="limit-filter"
          >
            <option value={10}>10 đơn/trang</option>
            <option value={20}>20 đơn/trang</option>
            <option value={50}>50 đơn/trang</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-container">
        {error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Không thể tải đơn hàng</h3>
            <p>{error}</p>
            <button onClick={fetchOrders} className="retry-btn">Thử lại</button>
          </div>
        ) : (
          <>
            <div className="orders-table">
              <div className="table-header">
                <div className="col-id">Mã đơn</div>
                <div className="col-customer">Khách hàng</div>
                <div className="col-date">Ngày đặt</div>
                <div className="col-amount">Tổng tiền</div>
                <div className="col-status">Trạng thái</div>
                <div className="col-actions">Thao tác</div>
              </div>
              
              {orders.map((order) => (
                <div key={order._id} className="order-row">
                  <div className="col-id">
                    <span className="order-id">#{order._id.slice(-8)}</span>
                  </div>
                  <div className="col-customer">
                    <div className="customer-info">
                      <span className="customer-name">{order.hoten}</span>
                      <span className="customer-phone">{order.sodienthoai}</span>
                    </div>
                  </div>
                  <div className="col-date">
                    {formatDate(order.ngaytao)}
                  </div>
                  <div className="col-amount">
                    <span className="amount">${order.tongtien}</span>
                  </div>
                  <div className="col-status">
                    <select
                      value={order.trangthai}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="status-select"
                      style={{ backgroundColor: getStatusColor(order.trangthai), color: 'white' }}
                      disabled={updatingStatus === order._id}
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="preparing">Đang chuẩn bị</option>
                      <option value="delivering">Đang giao hàng</option>
                      <option value="delivered">Đã giao hàng</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                  <div className="col-actions">
                    <button
                      className="view-detail-btn"
                      onClick={() => toggleOrderDetail(order._id)}
                    >
                      {expandedOrder === order._id ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Expanded Order Detail */}
            {expandedOrder && (
              <div className="order-detail-expanded">
                {(() => {
                  const order = orders.find(o => o._id === expandedOrder)
                  if (!order) return null
                  
                  return (
                    <div className="detail-content">
                      <div className="detail-header">
                        <h3>Chi tiết đơn hàng #{order._id.slice(-8)}</h3>
                        <div 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.trangthai) }}
                        >
                          {getStatusName(order.trangthai)}
                        </div>
                      </div>

                      <div className="detail-sections">
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

                        {/* Customer Info */}
                        <div className="detail-section">
                          <h4>Thông tin khách hàng</h4>
                          <div className="info-grid">
                            <div className="info-item">
                              <span className="info-label">Họ tên:</span>
                              <span className="info-value">{order.hoten}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Số điện thoại:</span>
                              <span className="info-value">{order.sodienthoai}</span>
                            </div>
                            <div className="info-item full-width">
                              <span className="info-label">Địa chỉ:</span>
                              <span className="info-value">{order.diachi}</span>
                            </div>
                            {order.ghichu && (
                              <div className="info-item full-width">
                                <span className="info-label">Ghi chú:</span>
                                <span className="info-value">{order.ghichu}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Products */}
                        <div className="detail-section">
                          <h4>Sản phẩm ({order.products?.length || 0})</h4>
                          {order.products && order.products.length > 0 ? (
                            <div className="products-list">
                              {order.products.map((product, index) => (
                                <div key={index} className="product-item">
                                  <img 
                                    src={`${url}/uploads/${product.image}`} 
                                    alt={product.ten}
                                    className="product-image"
                                  />
                                  <div className="product-info">
                                    <h5 className="product-name">{product.ten}</h5>
                                    <p className="product-description">{product.mota}</p>
                                    <div className="product-meta">
                                      <span className="product-category">{product.danhmuc}</span>
                                      <span className="product-quantity">Số lượng: {product.quantity}</span>
                                    </div>
                                  </div>
                                  <div className="product-price">
                                    <span className="product-unit-price">${product.gia}</span>
                                    <span className="product-total-price">
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
                  )
                })()}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="pagination-btn"
                >
                  Trước
                </button>
                
                <div className="pagination-info">
                  Trang {pagination.currentPage} / {pagination.totalPages}
                  ({pagination.totalOrders} đơn hàng)
                </div>
                
                <button
                  onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="pagination-btn"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Orders
