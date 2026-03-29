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

        // 🔥 USE BACKEND IF AVAILABLE
        if (backendData.length > 0) {
          setPopularProducts(backendData);
        } else {
          setPopularProducts(data_product); // fallback
        }
      })
      .catch((err) => {
        console.log("Backend error, using static:", err);

        // 🔥 FALLBACK TO STATIC
        setPopularProducts(data_product);
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
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;