import React, { useEffect, useState } from 'react'
import './Users.css'

const API_URL = 'http://localhost:4000'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(()=>{
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/nguoidung/list`)
        const data = await res.json()
        if (data.success) {
          setUsers(data.data || [])
        } else {
          setError(data.message || 'Không thể tải người dùng')
        }
      } catch (err) {
        setError('Lỗi kết nối server')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  return (
    <div className='users-page'>
      <div className='users-header'>
        <h2>Quản lý người dùng</h2>
      </div>
      <div className='users-table-wrapper'>
        {loading ? (
          <div style={{padding:16}}>Đang tải...</div>
        ) : error ? (
          <div style={{padding:16, color:'tomato'}}>{error}</div>
        ) : (
          <table className='users-table'>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Tên</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    {u.avatar ? (
                      <img className='user-avatar' src={`${API_URL}/anh/${u.avatar}`} alt='' />
                    ) : (
                      <div className='user-avatar placeholder'>NA</div>
                    )}
                  </td>
                  <td>{u.ten}</td>
                  <td>{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Users
