import React, { useEffect, useState } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';
import all_product_static from '../Assets/all_product';

const NewCollections = () => {

  const [new_collection, setNew_collection] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/allproducts")
      .then((res) => res.json())
      .then((data) => {

        const backendProducts = data?.products || data || [];

        // 🔥 SORT BACKEND (NEWEST FIRST)
        const sortedBackend = [...backendProducts].sort((a, b) => b.id - a.id);

        // 🔥 TAKE TOP BACKEND ITEMS (ensure new item visible)
        const backendTop = sortedBackend.slice(0, 4);

        // 🔥 SPLIT STATIC BY CATEGORY (NO BIAS)
        const men = all_product_static.filter(i => i.category === "men");
        const women = all_product_static.filter(i => i.category === "women");
        const kids = all_product_static.filter(
          i => i.category === "kid" || i.category === "kids"
        );

        // 🔥 TAKE MIX FROM STATIC
        const staticFill = [
          ...men.slice(0, 3),
          ...women.slice(0, 3),
          ...kids.slice(0, 2),
        ];

        // 🔥 FINAL MERGE
        const finalProducts = [...backendTop, ...staticFill];

        setNew_collection(finalProducts);
      })
      .catch((err) => {
        console.log("Error fetching:", err);

        // 🔥 FALLBACK STATIC (BALANCED)
        const men = all_product_static.filter(i => i.category === "men");
        const women = all_product_static.filter(i => i.category === "women");
        const kids = all_product_static.filter(
          i => i.category === "kid" || i.category === "kids"
        );

        const fallback = [
          ...men.slice(0, 4),
          ...women.slice(0, 4),
          ...kids.slice(0, 4),
        ];

        setNew_collection(fallback);
      });
  }, []);

  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />

      <div className="collections">
        {new_collection.map((item) => (
          <Item
            key={item.id}
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

export default NewCollections;