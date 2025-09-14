import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Trangchu from './pages/Trangchu/Trangchu'
import Giohang from './pages/Giohang/Giohang'
import Dathang from './pages/Dathang/Dathang'
import Donhang from './pages/Donhang/Donhang'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'

const App = () => {

  const[showDangnhap,setShowdangnhap] = useState(false)

  return (
    <>
    {showDangnhap?<LoginPopup setShowdangnhap={setShowdangnhap}/>:<></>}
    <div className='app'>
      <Navbar setShowdangnhap={setShowdangnhap}/>
            <Routes>
        <Route path='/' element={<Trangchu/>} />
        <Route path='/giohang' element={<Giohang/>} />
        <Route path='/dathang' element={<Dathang/>} />
        <Route path='/donhang' element={<Donhang/>} />
      </Routes>

    </div>
    <Footer/>
    </>
  )
}

export default App