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

        // ✅ combine static + backend
        const combined = [...data_product, ...backendData];

        setPopularProducts(combined);
      })
      .catch((err) => {
        console.log("Backend error, using static:", err);

        // fallback → only static
        setPopularProducts(data_product);
      });
  }, []);

  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr />

      <div className='popular-item'>
        {popularProducts.map((item, i) => {

          // ✅ SIMPLE IMAGE FIX
          let imageUrl = item.image;

          // if backend gives only filename
          if (typeof item.image === "string" && !item.image.startsWith("http") && !item.image.includes("/assets/")) {
            imageUrl = `https://ecommerce-production-4fee.up.railway.app/images/${item.image}`;
          }

          return (
            <Item
              key={item.id || i}
              id={item.id}
              name={item.name}
              image={imageUrl}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Popular;