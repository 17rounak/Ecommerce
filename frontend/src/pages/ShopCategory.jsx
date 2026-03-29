import React, { useContext, useState } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../context/ShopContext';
import dropdown_icon from '../components/Assets/dropdown_icon.png';
import Item from '../components/Item/Item';

const ShopCategory = (props) => {

  const { all_product } = useContext(ShopContext);

  // 🔥 STATE
  const [visibleCount, setVisibleCount] = useState(12);
  const [sortType, setSortType] = useState("default");

  // ✅ FILTER PRODUCTS (clean way)
  let filteredProducts = all_product.filter(
    (item) => item.category === props.category
  );

  // ✅ SORT LOGIC
  if (sortType === "low-high") {
    filteredProducts.sort((a, b) => a.new_price - b.new_price);
  } else if (sortType === "high-low") {
    filteredProducts.sort((a, b) => b.new_price - a.new_price);
  }

  return (
    <div className='shop-category'>

      <img className='shopcategory-banner' src={props.banner} alt="" />

      <div className="shopcategory-indexsort">
        <p>
          <span>Showing 1-{Math.min(visibleCount, filteredProducts.length)}</span> out of {filteredProducts.length} products
        </p>

        {/* 🔥 SORT DROPDOWN */}
        <select
          className="shopcategory-sort"
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="default">Sort by</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      {/* ✅ PRODUCTS */}
      <div className="shopcategory-products">
        {filteredProducts.slice(0, visibleCount).map((item) => (
          <Item
            key={item.id}   // 🔥 FIX (use id, not index)
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>

      {/* 🔥 LOAD MORE BUTTON */}
      {visibleCount < filteredProducts.length && (
        <div
          className="shopcategory-loadmore"
          onClick={() => setVisibleCount(prev => prev + 6)}
          style={{ cursor: "pointer" }}
        >
          Explore More
        </div>
      )}

    </div>
  );
};

export default ShopCategory;