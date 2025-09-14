import React from 'react'
import  './Sidebar.css'
import { NavLink } from 'react-router-dom'
const Sidebar = () => {
  return (
    <div className='sidebar'>
        <div className="sidebar-options">
            <NavLink to='/add' className="sidebar-option">
                <i className="bi bi-plus-square"></i>
                <p>Thêm</p>
            </NavLink>
            <NavLink to='/list' className="sidebar-option">
                <i className="bi bi-card-list"></i>
                <p>Danh sách</p>
            </NavLink>
            <NavLink to='/orders' className="sidebar-option">
                <i className="bi bi-truck"></i>
                <p>Đơn hàng</p>
            </NavLink>
            <NavLink to='/revenue' className="sidebar-option">
                <i className="bi bi-graph-up"></i>
                <p>Doanh thu</p>
            </NavLink>
            <NavLink to='/users' className="sidebar-option">
                <i className="bi bi-people"></i>
                <p>Người dùng</p>
            </NavLink>
        </div>

    </div>
  )
}

export default Sidebar