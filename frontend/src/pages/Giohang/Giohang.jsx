import React, { useContext } from 'react'
import './Giohang.css'
import { noidung } from '../../context/noidung'
import { useNavigate } from 'react-router-dom';

const Giohang = () => {

  const{cartItems,foodList,xoagioHang,tinhTongTien,url} = useContext(noidung);
  const navigate =useNavigate();

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
        <p>Mặt hàng</p>
        <p>Tiêu đề</p>
        <p>Giá</p>
        <p>Số lượng</p>
        <p>Tổng cộng</p>
        <p>Xóa</p>
        </div>
        <br />
        <hr />
        {foodList.map((item,index)=>{
          if(cartItems[item._id]>0)
          {
            return(
              <div key={index}> 
                 <div className="cart-items-title cart-items-item">
                <img src={url+"/anh/"+item.image} alt="" />
                <p>{item.ten}</p>
                <p>${item.gia}</p>
                <p>{cartItems[item._id]}</p>
                <p>${item.gia*cartItems[item._id]}</p>
                <p onClick={()=>xoagioHang(item._id)}className='cross'>x</p>
              </div>
              <hr/>
              </div>
             
            )
          }

        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Tổng giỏ hàng</h2>
          <div>
            <div className="cart-total-details">
                <p>Tạm tính</p>
                <p>${tinhTongTien()}</p>
            </div>
            <hr/>
            <div className="cart-total-details">
                <p>Phí vận chuyển</p>
                <p>${tinhTongTien()===0?0:2}</p>
            </div>
            <hr/>
            <div className="cart-total-details">
                <b>Tổng cộng</b>
                <b>${tinhTongTien()===0?0:tinhTongTien()+2}</b>
            </div>          
          </div>
          <button onClick={()=> navigate('/dathang')}>Tiến hành thanh toán</button>
        </div>
        <div className="cart-promocode">
          <p>Nhập mã khuyến mãi ở đây</p>
          <div className="cart-promocode-input">
            <input type="text" placeholder='Mã khuyến mãi' />
            <button>Nhập</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Giohang