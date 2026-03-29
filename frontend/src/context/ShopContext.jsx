import React, { createContext, useState, useEffect } from "react";
import all_product_static from "../components/Assets/all_product";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {

  const [all_product, setAll_Product] = useState(all_product_static);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem('auth-token'));

  // 🔥 INIT CART
  const initializeCart = (products) => {
    let cart = {};
    products.forEach((item) => {
      if (item && item.id !== undefined) {
        cart[item.id] = 0;
      }
    });
    return cart;
  };

  // ✅ FETCH PRODUCTS (FIXED — NO CART OVERWRITE)
  useEffect(() => {
    fetch("https://ecommerce-production-4fee.up.railway.app/allproducts")
      .then((res) => res.json())
      .then((data) => {

        const backendProducts = Array.isArray(data)
          ? data
          : data?.products || [];

        // 🔥 REMOVE DUPLICATES
        const mergedProducts = [
          ...backendProducts,
          ...all_product_static.filter(
            (sp) => !backendProducts.some(
              (bp) => Number(bp.id) === Number(sp.id)
            )
          )
        ];

        setAll_Product(mergedProducts);

        // 🔥 IMPORTANT FIX: DON'T RESET CART IF LOGGED IN
        if (!localStorage.getItem('auth-token')) {
          setCartItems(initializeCart(mergedProducts));
        }

      })
      .catch(() => {
        setAll_Product(all_product_static);

        if (!localStorage.getItem('auth-token')) {
          setCartItems(initializeCart(all_product_static));
        }
      });
  }, []);

  // 🔥 UPDATE TOKEN
  const updateToken = () => {
    const newToken = localStorage.getItem('auth-token');
    setToken(newToken);
  };

  // 🔥 FETCH CART (USED AFTER LOGIN)
  const fetchCart = (userToken) => {
    fetch("https://ecommerce-production-4fee.up.railway.app/getcart", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'auth-token': userToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("CART LOADED:", data);
        setCartItems(data.cart || {});
      })
      .catch((err) => {
        console.log("Cart fetch error:", err);
      });
  };

  // ✅ AUTO FETCH CART WHEN TOKEN CHANGES
  useEffect(() => {
    if (token) {
      fetchCart(token);
    } else {
      setCartItems({});
    }
  }, [token]);

  // ✅ ADD TO CART
  const addToCart = (itemId) => {

    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));

    if (token) {
      fetch("https://ecommerce-production-4fee.up.railway.app/addtocart", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'auth-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId })
      });
    }
  };

  // ✅ REMOVE FROM CART
  const removeFromCart = (itemId) => {

    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] > 0 ? prev[itemId] - 1 : 0
    }));

    if (token) {
      fetch("https://ecommerce-production-4fee.up.railway.app/removefromcart", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'auth-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId })
      });
    }
  };

  // ✅ TOTAL AMOUNT
  const getTotalCartAmount = () => {
    let total = 0;

    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let product = all_product.find(p => p.id == item);
        if (product) {
          total += product.new_price * cartItems[item];
        }
      }
    }

    return total;
  };

  // ✅ TOTAL ITEMS
  const getTotalCartItem = () => {
    let total = 0;
    for (const item in cartItems) {
      total += cartItems[item];
    }
    return total;
  };

  const contextValue = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItem,
    updateToken,
    fetchCart
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;