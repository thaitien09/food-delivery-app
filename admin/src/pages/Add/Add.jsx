import React, {  useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = () => {
    const url="http://localhost:4000"
    const[image,setImage] =useState(false);
    const[data,setData] = useState({
        ten:"",
        mota:"",
        gia:"",
        danhmuc:"Salad"
    })

    const onChangeHadler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}))
    }

    const onsubmitHandler = async(event) =>{
        event.preventDefault();
        const formData = new FormData();
        formData.append("ten",data.ten)
        formData.append("mota",data.mota)
        formData.append("gia",Number(data.gia))
        formData.append("danhmuc",data.danhmuc)
        if (image) {
            formData.append("image", image)
        }
        const response = await axios.post(`${url}/api/monan/them`,formData)
        if (response.data.success){
            setData({
                ten:"",
                mota:"",
                gia:"",
                danhmuc:"Salad"
            })
            setImage(false)
            toast.success(response.data.message)
        } else {
            toast.error(response.data.message) // Thay alert bằng toast.error
        }
    }
   

  return (
    <div className='add'>
  <form className='flex-col' onSubmit={onsubmitHandler}>
    {/* Upload ảnh */}
    <div className="add-img-upload flex-col">
      <p>Upload Image</p>
      <label htmlFor='image'>
        <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
      </label>
      <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" name="image" hidden required />
    </div>

    {/* Tên sản phẩm */}
    <div className="add-product-name flex-col">
      <p>Tên sản phẩm</p>
      <input onChange={onChangeHadler} value={data.ten}type="text" name='ten' placeholder='Nhập ở đây' required />
    </div>

    {/* Mô tả sản phẩm */}
    <div className="add-product-description flex-col">
      <p>Mô tả sản phẩm</p>
      <textarea onChange={onChangeHadler} value={data.mota} name='mota' rows="6" placeholder='Viết ở đây' required></textarea>
    </div>

    {/* Danh mục & Giá */}
    <div className="add-category-price">
      <div className="add-category flex-col">
        <p>Danh mục sản phẩm</p>
        <select name="danhmuc" value={data.danhmuc} onChange={onChangeHadler} required>

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
      </div>

      <div className="add-price flex-col">
        <p>Giá sản phẩm</p>
        <input onChange={onChangeHadler} value={data.gia}type="number" name='gia' placeholder='$20' required />
      </div>
    </div>

    <button type='submit' className='add-btn'>Thêm</button>
  </form>
</div>
  )
}

export default Add