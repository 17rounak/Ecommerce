import React, { useState, useContext } from 'react';
import './CSS/LoginSignup.css';
import { ShopContext } from '../context/ShopContext'; // adjust path if needed

const LoginSignup = () => {

  const [state, setState] = useState("Sign Up");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const { updateToken, fetchCart } = useContext(ShopContext);

  // handle input
  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ LOGIN
  const login = async () => {

    let responseData;

    await fetch('https://ecommerce-production-4fee.up.railway.app/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => responseData = data);

    if (responseData.success) {

      // 🔥 SAVE TOKEN
      localStorage.setItem('auth-token', responseData.token);

      // 🔥 FIX: UPDATE CONTEXT + FETCH CART
      updateToken();
      fetchCart(responseData.token);

      // 🔥 DELAY NAVIGATION (IMPORTANT)
      setTimeout(() => {
        window.location.replace("/");
      }, 300);

    } else {
      alert(responseData.errors);
    }
  };

  // ✅ SIGNUP
  const signup = async () => {

    let responseData;

    await fetch('https://ecommerce-production-4fee.up.railway.app/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => responseData = data);

    if (responseData.success) {

      localStorage.setItem('auth-token', responseData.token);

      // 🔥 SAME FIX HERE
      updateToken();
      fetchCart(responseData.token);

      setTimeout(() => {
        window.location.replace("/");
      }, 300);

    } else {
      alert(responseData.errors);
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">

        <h1>{state}</h1>

        <div className="loginsignup-fields">

          {state === "Sign Up" && (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
            />
          )}

          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
          />

          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
          />

        </div>

        <button onClick={() => {
          state === "Login" ? login() : signup()
        }}>
          Continue
        </button>

        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span onClick={() => setState("Login")}>Login here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?{" "}
            <span onClick={() => setState("Sign Up")}>Click here</span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

      </div>
    </div>
  );
};

export default LoginSignup;