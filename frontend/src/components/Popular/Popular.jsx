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

        // ✅ combine static + backend (no image logic here)
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
        {popularProducts.map((item, i) => (
          <Item
            key={item.id || i}
            id={item.id}
            name={item.name}
            image={item.image}   // ✅ DO NOT TOUCH IMAGE HERE
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;