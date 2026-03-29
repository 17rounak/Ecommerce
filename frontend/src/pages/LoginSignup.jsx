import React, { useState, useContext } from 'react';
import './CSS/LoginSignup.css';
import { ShopContext } from '../context/ShopContext';

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
    try {
      const res = await fetch('https://ecommerce-production-4fee.up.railway.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('auth-token', data.token);

        updateToken();
        fetchCart(data.token);

        setTimeout(() => {
          window.location.replace("/");
        }, 300);

      } else {
        alert(data.message || "Invalid email or password");
      }

    } catch (error) {
      console.error(error);
      alert("Server error. Please try again later.");
    }
  };

  // ✅ SIGNUP
  const signup = async () => {
    try {
      const res = await fetch('https://ecommerce-production-4fee.up.railway.app/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('auth-token', data.token);

        updateToken();
        fetchCart(data.token);

        setTimeout(() => {
          window.location.replace("/");
        }, 300);

      } else {
        alert(data.message || "Signup failed");
      }

    } catch (error) {
      console.error(error);
      alert("Server error. Please try again later.");
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