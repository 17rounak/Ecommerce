import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from '../Item/Item';
import data_product from '../Assets/data';

const Popular = () => {

  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetch("https://ecommerce-production-4fee.up.railway.app/popularinwomen")
      .then((response) => response.json())
      .then((data) => {

        const backendData = data?.products || data || [];

        // ✅ FILTER STATIC WOMEN PRODUCTS
        const staticWomen = data_product.filter(
          (item) => item.category?.toLowerCase() === "women"
        );

        // ✅ MERGE STATIC + BACKEND
        const combined = [...staticWomen, ...backendData];

        setPopularProducts(combined);
      })
      .catch((err) => {
        console.log("Backend error, using static:", err);

        // fallback
        const staticWomen = data_product.filter(
          (item) => item.category?.toLowerCase() === "women"
        );

        setPopularProducts(staticWomen);
      });
  }, []);

  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr />

      <div className='popular-item'>
        {popularProducts.map((item, i) => (
          <Item
            key={item.id || i}
            id={item.id}
            name={item.name}

            // 🔥 FIX IMAGE HERE
            image={
  item.image?.includes("http")
    ? item.image
    : `https://ecommerce-production-4fee.up.railway.app/${item.image}`
}

            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;