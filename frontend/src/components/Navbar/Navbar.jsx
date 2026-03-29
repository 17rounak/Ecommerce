import './Navbar.css'
import React, { useState,useContext,useRef } from 'react';
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from "react-router-dom";
import { ShopContext } from '../../context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png'

const Navbar=()=>{

    const [menu,setMenu]=useState("shop");
    const {getTotalCartItem}=useContext(ShopContext);
    const menuRef=useRef(); 
    const dropdown_toggle = (e) =>{
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }



    return (
        <div className='navbar'>
            <div className="nav-logo">
                <img src={logo}alt=""/>
                <p>SHOPPER</p>
            </div>
            <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt=""/>
            <ul  ref={menuRef} className='nav-menu'>
                <li onClick={()=>{setMenu("shop")}}><Link to="/">Shop</Link></li>
                <li onClick={()=>{setMenu("mens")}}><Link to="/mens">Men</Link></li>
                <li onClick={()=>{setMenu("womens")}}><Link to="/womens">Women</Link></li>
                <li onClick={()=>{setMenu("kids")}}><Link to="/kids">Kids</Link></li>
            </ul>
            <div className='nav-login-cart'>
    {localStorage.getItem('auth-token') ? (
        <button onClick={() => {
            localStorage.removeItem('auth-token');
            window.location.replace('/');
        }}>
            Logout
        </button>
    ) : (
        <Link to="/login"><button>Login</button></Link>
    )}

    <Link to="/cart"><img src={cart_icon} alt=""/></Link>
    <div className="nav-cart-count">{getTotalCartItem()}</div>
</div>
        </div>
    )
}

export default Navbar