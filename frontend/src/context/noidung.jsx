import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const noidung = createContext(null);

const NoidungProvider = (props) => {

    const[cartItems,setCartItems] = useState({});
    const url = "http://localhost:4000"
    const [token,setToken] = useState("");
    const [foodList,setFoodList] = useState([])


    // Lấy userId từ token (giả sử JWT payload có .id)
    const getUserId = () => {
      try {
        const tokenStr = localStorage.getItem("token");
        if (!tokenStr) return null;
        const payload = JSON.parse(atob(tokenStr.split('.')[1]));
        return payload.id;
      } catch {
        return null;
      }
    };

    // Lấy giỏ hàng từ backend
    const fetchCartFromBackend = async () => {
      const userId = getUserId();
      if (!userId) return;
      try {
        const res = await axios.get(`${url}/api/cart/get`, {
          headers: { token: localStorage.getItem("token") }
        });
        if (res.data.success && res.data.giohangData) {
          setCartItems(res.data.giohangData);
        }
      } catch (err) {
        // Có thể log lỗi nếu cần
      }
    };

    // Thêm sản phẩm vào giỏ hàng (backend)
    const themgioHang = async (itemId) => {
      const userId = getUserId();
      if (!userId) return;
      try {
        await axios.post(`${url}/api/cart/add`, {
          userId,
          itemId
        }, {
          headers: { token: localStorage.getItem("token") }
        });
        fetchCartFromBackend();
      } catch (err) {}
    };

    // Xóa sản phẩm khỏi giỏ hàng (giảm số lượng)
    const xoagioHang = async (itemId) => {
      const userId = getUserId();
      if (!userId) return;
      try {
        await axios.post(`${url}/api/cart/remove`, {
          userId,
          itemId
        }, {
          headers: { token: localStorage.getItem("token") }
        });
        fetchCartFromBackend();
      } catch (err) {}
    };

    // Xóa toàn bộ giỏ hàng (sau khi đặt hàng thành công)
    const clearCart = () => {
      setCartItems({});
    };

  const tinhTongTien = () => {
    let tong = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = foodList.find((product) => product._id === item);
        if (itemInfo) {
          tong += itemInfo.gia * cartItems[item];
        }
      }
    }
    return tong;
  };

  const fetchFoodList = async ()  => {
    try {
      const response = await axios.get(url+"/api/monan/list");
      if (response.data.success) {
        setFoodList(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách món ăn:", error);
    }
  }


  useEffect(()=>{  
    async function loadData() {
      await fetchFoodList();
      if(localStorage.getItem("token")){
        setToken(localStorage.getItem("token"));
        await fetchCartFromBackend();
      }
    }
    loadData();
  },[])



  const noidungValue = {
    foodList,
    cartItems,
    setCartItems,
    themgioHang,
    xoagioHang,
    clearCart,
    tinhTongTien,
    url,
    token,
    setToken
  };

  return (
    <noidung.Provider value={noidungValue}>
      {props.children}
    </noidung.Provider>
  );
};

export default NoidungProvider
