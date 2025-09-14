import React, { useContext, useState, useRef, useEffect } from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { noidung } from '../../context/noidung'
import axios from 'axios'

const Navbar = ({setShowdangnhap}) => {

const [menu,setMenu] = useState("trangchu")
const [showDropdown, setShowDropdown] = useState(false)
const dropdownRef = useRef()
const fileInputRef = useRef()

  const{tinhTongTien,token,setToken,url} =useContext(noidung)

  const navigate = useNavigate();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/")
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const openFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
    setShowDropdown(false);
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Ảnh quá lớn (tối đa 2MB)');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const tokenStr = localStorage.getItem('token');
      if (!tokenStr) {
        alert('Vui lòng đăng nhập lại');
        return;
      }
      const payload = JSON.parse(atob(tokenStr.split('.')[1]));
      const userId = payload.id;

      const response = await axios.put(`${url}/api/nguoidung/avatar/${userId}` , formData);
      if (response.data.success) {
        localStorage.setItem('userAvatar', response.data.avatar);
        alert('Cập nhật ảnh đại diện thành công!');
        window.location.reload();
      } else {
        alert(response.data.message || 'Cập nhật ảnh đại diện thất bại');
      }
    } catch (error) {
      alert(error?.response?.data?.message || 'Có lỗi khi upload ảnh đại diện');
      console.error(error);
    }
  };

  return (
    <div className='navbar'>
        <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
        <ul className="navbar-menu">
            <Link to='/' onClick={()=>setMenu("trangchu")} className={menu==="trangchu"?"active":""}>Trang chủ</Link>
            <a href='#explore-menu' onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>Menu </a>
            <a href='#app-download' onClick={()=>setMenu("didong")} className={menu==="didong"?"active":""}>Tải App</a>
            <a href='#footer' onClick={()=>setMenu("lienhe")} className={menu==="lienhe"?"active":""}>Liên hệ</a>
        </ul>
        <div className="navbar-right">
            <img src={assets.search_icon} alt="" />
            <div className="navbar-search-icon">
                <Link to='/giohang'> <img src={assets.basket_icon} alt="" /></Link>
                <div className={tinhTongTien()===0?"":"dot"}></div>
            </div>
            {!token?<button onClick={()=>setShowdangnhap(true)}>Đăng nhập</button>
            :<div className='navbar-profile' ref={dropdownRef}>
              <img 
                src={localStorage.getItem('userAvatar') ? `${url}/anh/${localStorage.getItem('userAvatar')}` : assets.profile_icon} 
                alt="" 
                className="profile-avatar"
                onClick={toggleDropdown}
              />
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleAvatarUpload} style={{display:'none'}} />
              <ul className={`nav-profile-dropdown ${showDropdown ? 'show' : ''}`}>
                <li onClick={() => navigate('/donhang')}> <img src={assets.bag_icon} alt="" />Đơn hàng</li>
                <hr />
                <li onClick={openFileInput}> <img src={assets.profile_icon} alt="" />Cập nhật ảnh đại diện</li>
                <hr />
                <li onClick={logout}> <img src={assets.logout_icon} alt="" />Đăng xuất</li>
              </ul>
            </div>}

        </div>
    </div>
  )
}

export default Navbar