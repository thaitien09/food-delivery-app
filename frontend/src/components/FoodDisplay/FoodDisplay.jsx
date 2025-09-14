import React, { useContext, useState } from 'react'
import './FoodDisplay.css'
import { noidung } from '../../context/noidung'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {

    const {foodList} = useContext(noidung)
    const [sortOrder, setSortOrder] = useState('default')

    const getSortedList = (list) => {
        if (sortOrder === 'asc') {
            return [...list].sort((a,b)=> (a.gia||0) - (b.gia||0))
        }
        if (sortOrder === 'desc') {
            return [...list].sort((a,b)=> (b.gia||0) - (a.gia||0))
        }
        return list
    }

  const filteredByCategory = foodList.filter(item => (category === "All" || category === item.danhmuc))
  const finalList = getSortedList(filteredByCategory)

  return (
    <div className='food-display' id='food-display'>
        <h2>Những món ăn nổi bật</h2>

        <div className="food-filter-bar">
            <select className="price-filter" value={sortOrder} onChange={(e)=>setSortOrder(e.target.value)}>
                <option value="default">Mới nhất</option>
                <option value="asc">Giá: Thấp đến Cao</option>
                <option value="desc">Giá: Cao đến Thấp</option>
            </select>
        </div>

        <div className="food-display-list">
            {finalList.map((item,index)=>{
                return <FoodItem key = {index} id={item._id} name={item.ten} description={item.mota} price={item.gia} image={item.image} />
            })}
        </div>
    </div>
  )
}

export default FoodDisplay