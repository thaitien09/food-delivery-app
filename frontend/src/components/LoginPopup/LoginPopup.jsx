import React, {  useContext, useState } from 'react'
import { assets } from '../../assets/assets';
import './LoginPopup.css'
import { noidung } from '../../context/noidung';
import axios from "axios"


const LoginPopup = ({setShowdangnhap}) => {

    const{url,setToken} = useContext(noidung)

    const [trangThaiHienTai, setTrangThaiHienTai] = useState("Đăng nhập");
    const [data,setdata] = useState({
        ten:"",
        email:"",
        matkhau:""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value =event.target.value;
        setdata(data=>({...data,[name]:value}))
    }

    const xuLyDangNhap = async (event) => {
        // Xử lý logic đăng nhập
        event.preventDefault()
        let newUrl = url;
        if (trangThaiHienTai==="Đăng nhập") {
            newUrl += "/api/nguoidung/dangnhap"
        }
        else {
            newUrl += "/api/nguoidung/dangky"
        }
        const response = await axios.post(newUrl,data);
        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token",response.data.token)
            setShowdangnhap(false)
        }
        else{
            alert(response.data.message)
        }
    }
    
  return (
    <div className='login-popup'>
        <form onSubmit={xuLyDangNhap}  className="login-popup-container">
            <div className="login-popup-title">
                <h2>{trangThaiHienTai}</h2>
                <img onClick={()=>setShowdangnhap(false)} src={assets.cross_icon} alt="" />
            </div>
            <div className="login-popup-inputs">
                {trangThaiHienTai==="Đăng nhập"?<></>:<input name='ten' onChange={onChangeHandler} value={data.ten} type="text" placeholder='Tên của bạn' required />}
                <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email của bạn' required />
                <input name='matkhau' onChange={onChangeHandler} value={data.matkhau} type="password" placeholder='Mật khẩu' required />
            </div>
            <button type='submit' >{trangThaiHienTai==="Đăng ký"?"Tạo tài khoản":"Đăng nhập"}</button>
            <div className="login-popup-condition">
                <input type="checkbox" required/>
                <p>Bằng cách tiếp tục, tôi đồng ý với điều khoản sử dụng và chính sách bảo mật.</p>
            </div>
            {trangThaiHienTai==="Đăng nhập"
            ?<p>Tạo tài khoản mới? <span onClick={()=>setTrangThaiHienTai("Đăng ký")}>Nhấn vào đây</span></p>
            :<p>Bạn đã có tài khoản? <span onClick={()=>setTrangThaiHienTai("Đăng nhập")}>Đăng nhập ngay</span></p>
        }
        </form>
    </div>
  )
}

export default LoginPopup