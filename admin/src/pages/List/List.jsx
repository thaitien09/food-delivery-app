import React, { useEffect, useState } from "react";
import './List.css';
import axios from "axios";

const MonanList = () => {
  const [monan, setMonan] = useState([]);
  const [editing, setEditing] = useState(null); // món đang edit
  const [formData, setFormData] = useState({
    ten: "",
    mota: "",
    gia: "",
    danhmuc: "",
    image: null
  });

  const fetchMonan = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/monan/list");
      const data = await res.json();
      if (data.success) {
        setMonan(data.data);
      }
    } catch (err) {
      console.error("Lỗi fetch:", err);
    }
  };

  useEffect(() => {
    fetchMonan();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa món ăn này?")) return;
    try {
      const res = await fetch("http://localhost:4000/api/monan/xoa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Xóa thành công");
        fetchMonan();
      } else {
        alert("Lỗi khi xóa: " + data.message);
      }
    } catch (err) {
      console.error("Lỗi xóa:", err);
    }
  };

  const startEdit = (item) => {
    setEditing(item);
    setFormData({
      ten: item.ten,
      mota: item.mota,
      gia: item.gia,
      danhmuc: item.danhmuc,
      image: null
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editing) return;

    const data = new FormData();
    data.append("ten", formData.ten);
    data.append("mota", formData.mota);
    data.append("gia", formData.gia);
    data.append("danhmuc", formData.danhmuc);
    if (formData.image) data.append("image", formData.image);

    try {
      const res = await axios.put(`http://localhost:4000/api/monan/sua/${editing._id}`, data);
      if (res.data.success) {
        alert("Cập nhật thành công");
        setEditing(null);
        fetchMonan();
      } else {
        alert("Lỗi cập nhật: " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi gửi request sửa món ăn");
    }
  };

  return (
    <div className="monan-list">
      <h2>Danh sách món ăn</h2>
      <table className="monan-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Mô tả</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {monan.map(item => (
            <tr key={item._id}>
              <td>{item.ten}</td>
              <td>{item.mota}</td>
              <td>{item.gia}$</td>
              <td>{item.danhmuc}</td>
              <td>
                <img src={`http://localhost:4000/uploads/${item.image}`} alt={item.ten} width="60" />
              </td>
              <td>
                <button onClick={() => handleDelete(item._id)}>Xóa</button>
                <button onClick={() => startEdit(item)}>Sửa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
  <div className="modal">
    <form onSubmit={handleUpdate} className="edit-form">
      <h3>Sửa món ăn</h3>
      <input name="ten" value={formData.ten} onChange={handleChange} placeholder="Tên" required />
      <textarea name="mota" value={formData.mota} onChange={handleChange} placeholder="Mô tả" required />
      <input type="number" name="gia" value={formData.gia} onChange={handleChange} placeholder="Giá" required />

      {/* Danh mục */}
      <select name="danhmuc" value={formData.danhmuc} onChange={handleChange} required>
        <option value="">-- Chọn danh mục --</option>
        <option value="Salad">Salad</option>
        <option value="Cuộn">Cuộn</option>
        <option value="Tráng Miệng">Tráng Miệng</option>
        <option value="Bánh Mì Kẹp">Bánh Mì Kẹp</option>
        <option value="Bánh Ngọt">Bánh Ngọt</option>
        <option value="Món Chay">Món Chay</option>
        <option value="Mì Ý">Mì Ý</option>
        <option value="Mì">Mì</option>
      </select>

      <input type="file" name="image" onChange={handleChange} />
      <button type="submit">Cập nhật</button>
      <button type="button" onClick={() => setEditing(null)}>Hủy</button>
    </form>
  </div>
)}
    </div>
  );
};

export default MonanList;
