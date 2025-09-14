import React, { useContext, useState } from 'react'
import './Dathang.css'
import { noidung } from '../../context/noidung'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Dathang = () => {
  const { cartItems, foodList, tinhTongTien, url, clearCart } = useContext(noidung)
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    hoten: '',
    sodienthoai: '',
    diachi: '',
    ghichu: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Kiểm tra giỏ hàng có sản phẩm không
  const hasItems = Object.keys(cartItems).some(itemId => cartItems[itemId] > 0)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Validation cơ bản
    if (!formData.hoten.trim()) {
      setError('Vui lòng nhập họ tên')
      setIsSubmitting(false)
      return
    }
    if (!formData.sodienthoai.trim()) {
      setError('Vui lòng nhập số điện thoại')
      setIsSubmitting(false)
      return
    }
    if (!formData.diachi.trim()) {
      setError('Vui lòng nhập địa chỉ')
      setIsSubmitting(false)
      return
    }

    try {
      const tongtien = tinhTongTien() + 2 // +2 phí vận chuyển
      
      const response = await axios.post(`${url}/api/order/create`, {
        hoten: formData.hoten,
        sodienthoai: formData.sodienthoai,
        diachi: formData.diachi,
        ghichu: formData.ghichu,
        giohangData: cartItems,
        tongtien: tongtien
      }, {
        headers: {
          token: localStorage.getItem('token')
        }
      })

      if (response.data.success) {
        clearCart()
        navigate('/donhang', { 
          state: { 
            message: 'Đặt hàng thành công!' 
          } 
        })
      }
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error)
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!hasItems) {
    return (
      <div className='dathang'>
        <div className="empty-cart">
          <h2>Giỏ hàng trống</h2>
          <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng</p>
          <button onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
        </div>
      </div>
    )
  }

  return (
    <div className='dathang'>
      <div className="dathang-container">
        <div className="dathang-left">
          <h2>Thông tin đặt hàng</h2>
          <form onSubmit={handleSubmit} className="order-form">
            <div className="form-group">
              <label htmlFor="hoten">Họ và tên *</label>
              <input
                type="text"
                id="hoten"
                name="hoten"
                value={formData.hoten}
                onChange={handleInputChange}
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="sodienthoai">Số điện thoại *</label>
              <input
                type="tel"
                id="sodienthoai"
                name="sodienthoai"
                value={formData.sodienthoai}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="diachi">Địa chỉ giao hàng *</label>
              <textarea
                id="diachi"
                name="diachi"
                value={formData.diachi}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ giao hàng chi tiết"
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ghichu">Ghi chú (tùy chọn)</label>
              <textarea
                id="ghichu"
                name="ghichu"
                value={formData.ghichu}
                onChange={handleInputChange}
                placeholder="Ghi chú thêm cho đơn hàng"
                rows="2"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
          </form>
        </div>

        <div className="dathang-right">
          <h2>Đơn hàng của bạn</h2>
          <div className="order-summary">
            {foodList.map((item) => {
              if (cartItems[item._id] > 0) {
                return (
                  <div key={item._id} className="order-item">
                    <img src={`${url}/anh/${item.image}`} alt={item.ten} />
                    <div className="item-info">
                      <h4>{item.ten}</h4>
                      <p>Số lượng: {cartItems[item._id]}</p>
                      <p>Giá: ${item.gia}</p>
                    </div>
                    <div className="item-total">
                      ${item.gia * cartItems[item._id]}
                    </div>
                  </div>
                )
              }
              return null
            })}
          </div>

          <div className="order-total">
            <div className="total-row">
              <span>Tạm tính:</span>
              <span>${tinhTongTien()}</span>
            </div>
            <div className="total-row">
              <span>Phí vận chuyển:</span>
              <span>${tinhTongTien() === 0 ? 0 : 2}</span>
            </div>
            <div className="total-row total-final">
              <span>Tổng cộng:</span>
              <span>${tinhTongTien() === 0 ? 0 : tinhTongTien() + 2}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dathang
