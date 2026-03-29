import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {

  const [image, setImage] = useState(false)

  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: ""
  })

  const [message, setMessage] = useState("");

  // Handle input change
  const changeHandler = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value
    })
  }

  // Handle image upload
  const imageHandler = (e) => {
    setImage(e.target.files[0])
  }

  // Add product (for now just console)
  const Add_Product = async () => {
  try {

    if (!image) {
      setMessage("Please select an image ❗");
      return;
    }

    let formData = new FormData();
    formData.append("product", image);

    const uploadRes = await fetch("https://ecommerce-production-4fee.up.railway.app/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();

    if (!uploadData.success) {
      setMessage("Image upload failed ❌");
      return;
    }

    const product = {
      ...productDetails,
      image: uploadData.image_url,
    };

    const res = await fetch("https://ecommerce-production-4fee.up.railway.app/addproduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Product Added ✅");
    } else {
      setMessage("Failed ❌");
    }

  } catch (error) {
    console.error(error);
    setMessage("Error ⚠️");
  }
};

  return (
    <div className='add-product'>

      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>

      <div className="addproduct-price">

        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>

        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
          />
        </div>

      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className='add-product-selector'
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className='addproduct-thumbnail-img'
            alt=""
          />
        </label>

        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>

      <button
        onClick={Add_Product}
        className='addproduct-btn'
      >
        ADD
      </button>
      <p>{message}</p>
      

    </div>
  )
}

export default AddProduct