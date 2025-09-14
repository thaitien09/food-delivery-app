import React, { useState, useEffect } from 'react'
import './Revenue.css'
import axios from 'axios'

const Revenue = () => {
  const url = "http://localhost:4000"
  
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    period: 'month',
    startDate: '',
    endDate: ''
  })

  // Lấy thống kê doanh thu
  const fetchRevenueStats = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.startDate && filters.endDate) {
        params.append('startDate', filters.startDate)
        params.append('endDate', filters.endDate)
      } else {
        params.append('period', filters.period)
      }

      const response = await axios.get(`${url}/api/revenue/stats?${params}`, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      
      if (response.data.success) {
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Lỗi khi lấy thống kê doanh thu:', error)
      setError('Không thể tải thống kê doanh thu')
    } finally {
      setLoading(false)
    }
  }

  // Format số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Format ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Xử lý thay đổi filter
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault()
    fetchRevenueStats()
  }

  useEffect(() => {
    fetchRevenueStats()
  }, [])

  if (loading && !stats.totalRevenue) {
    return (
      <div className='revenue-page'>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thống kê doanh thu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='revenue-page'>
      {/* Header */}
      <div className="page-header">
        <h1>Thống kê doanh thu</h1>
        <p>Phân tích doanh thu và lợi nhuận từ đơn hàng đã giao</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Khoảng thời gian:</label>
          <select 
            value={filters.period} 
            onChange={(e) => handleFilterChange('period', e.target.value)}
            disabled={filters.startDate && filters.endDate}
          >
            <option value="today">Hôm nay</option>
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
            <option value="year">1 năm qua</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Từ ngày:</label>
          <input 
            type="date" 
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Đến ngày:</label>
          <input 
            type="date" 
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>
        
        <button onClick={handleSearch} className="search-btn">
          <i className="bi bi-search"></i>
          Tìm kiếm
        </button>
      </div>

      {error ? (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Không thể tải thống kê</h3>
          <p>{error}</p>
          <button onClick={fetchRevenueStats} className="retry-btn">Thử lại</button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card revenue">
              <div className="card-icon">
                <i className="bi bi-cash-stack"></i>
              </div>
              <div className="card-content">
                <h3>Tổng doanh thu</h3>
                <p className="amount">{formatCurrency(stats.totalRevenue || 0)}</p>
                <span className="label">Từ {stats.orderCount || 0} đơn hàng</span>
              </div>
            </div>

            <div className="summary-card profit">
              <div className="card-icon">
                <i className="bi bi-graph-up"></i>
              </div>
              <div className="card-content">
                <h3>Lợi nhuận</h3>
                <p className="amount">{formatCurrency(stats.totalProfit || 0)}</p>
                <span className="label">Tỷ lệ: {stats.profitMargin || 0}%</span>
              </div>
            </div>

            <div className="summary-card cost">
              <div className="card-icon">
                <i className="bi bi-cart-x"></i>
              </div>
              <div className="card-content">
                <h3>Chi phí</h3>
                <p className="amount">{formatCurrency(stats.totalCost || 0)}</p>
                <span className="label">60% doanh thu</span>
              </div>
            </div>

            <div className="summary-card orders">
              <div className="card-icon">
                <i className="bi bi-truck"></i>
              </div>
              <div className="card-content">
                <h3>Đơn hàng</h3>
                <p className="amount">{stats.orderCount || 0}</p>
                <span className="label">Đã giao hàng</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            {/* Daily Revenue Chart */}
            <div className="chart-container">
              <h3>Doanh thu theo ngày</h3>
              <div className="chart-content">
                {stats.dailyStats && stats.dailyStats.length > 0 ? (
                  <div className="daily-chart">
                    {stats.dailyStats.map((day, index) => (
                      <div key={index} className="chart-bar">
                        <div 
                          className="bar" 
                          style={{ 
                            height: `${(day.revenue / Math.max(...stats.dailyStats.map(d => d.revenue))) * 100}%` 
                          }}
                        ></div>
                        <span className="bar-label">{formatDate(day._id)}</span>
                        <span className="bar-value">{formatCurrency(day.revenue)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">Không có dữ liệu</p>
                )}
              </div>
            </div>

            {/* Category Revenue */}
            <div className="chart-container">
              <h3>Doanh thu theo danh mục</h3>
              <div className="chart-content">
                {stats.categoryStats && stats.categoryStats.length > 0 ? (
                  <div className="category-list">
                    {stats.categoryStats.map((category, index) => (
                      <div key={index} className="category-item">
                        <div className="category-info">
                          <span className="category-name">{category._id}</span>
                          <span className="category-quantity">({category.quantity} sản phẩm)</span>
                        </div>
                        <span className="category-revenue">{formatCurrency(category.revenue)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">Không có dữ liệu</p>
                )}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="top-products-section">
            <h3>Top sản phẩm bán chạy</h3>
            <div className="products-table">
              <div className="table-header">
                <div className="col-rank">#</div>
                <div className="col-name">Tên sản phẩm</div>
                <div className="col-price">Giá</div>
                <div className="col-quantity">Số lượng</div>
                <div className="col-revenue">Doanh thu</div>
              </div>
              
              {stats.topProducts && stats.topProducts.length > 0 ? (
                stats.topProducts.map((product, index) => (
                  <div key={index} className="product-row">
                    <div className="col-rank">
                      <span className="rank-badge">{index + 1}</span>
                    </div>
                    <div className="col-name">{product._id.productName}</div>
                    <div className="col-price">{formatCurrency(product._id.productPrice)}</div>
                    <div className="col-quantity">{product.totalQuantity}</div>
                    <div className="col-revenue">{formatCurrency(product.totalRevenue)}</div>
                  </div>
                ))
              ) : (
                <div className="no-data-row">
                  <p>Không có dữ liệu</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Revenue
