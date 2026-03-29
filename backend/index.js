const express = require("express");
const app = express();

const port = process.env.PORT||4000;

const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

/* ================= TEST ROUTE ================= */
app.get("/test", (req, res) => {
  res.send("Working");
});

/* ================= DB ================= */
mongoose.connect("mongodb+srv://bestfrand21:Jr9cbaD1r7JzxKw7@cluster0.6jygwts.mongodb.net/e-commerce")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("DB Error:", err));

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

/* ================= STATIC ================= */
app.use('/images', express.static('upload/images'));

/* ================= UPLOAD ================= */
app.post("/upload", upload.single('product'), (req, res) => {

  console.log("FILE:", req.file); // 🔍 debug

  if (!req.file) {
    return res.status(400).json({
      success: 0,
      message: "No file uploaded"
    });
  }

  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

/* ================= MODEL ================= */
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

const Product = mongoose.model("Product", productSchema);

/* ================= ADD PRODUCT ================= */
app.post("/addproduct", async (req, res) => {
  try {
    let id = 1;

    const lastProduct = await Product.findOne().sort({ id: -1 });

    if (lastProduct) {
      id = lastProduct.id + 1;
    }

    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    await product.save();

    res.json({
      success: true,
      product,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error saving product",
    });
  }
});


app.post('/removeproduct', async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.body.id });

    if (!deletedProduct) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    console.log("Removed:", deletedProduct.name);

    res.json({
      success: true,
      deletedProduct,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
    });
  }
});


app.get('/allproducts', async (req, res) => {
  try {
    const products = await Product.find({});

    console.log("All Products Fetched");

    res.json({
      success: true,
      count: products.length,
      products: products,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
    });
  }
}); 


const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Users;


const jwt = require("jsonwebtoken");

app.post("/signup", async (req, res) => {
  try {

    // check if user exists
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({
        success: false,
        errors: "Existing user found with same email",
      });
    }

    // create empty cart
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    // create user
    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    });

    await user.save();

    // create token
    const data = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(data, "secret_ecom"); // add secret key

    res.json({
      success: true,
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

app.post('/login', async (req, res) => {
  try {

    let user = await Users.findOne({ email: req.body.email });

    // ❌ user not found
    if (!user) {
      return res.json({
        success: false,
        errors: "Wrong Email Id"
      });
    }

    // ❌ password mismatch
    const passCompare = req.body.password === user.password;

    if (!passCompare) {
      return res.json({
        success: false,
        errors: "Wrong Password"
      });
    }

    // ✅ success
    const data = {
      user: {
        id: user.id
      }
    };

    const token = jwt.sign(data, "secret_ecom");

    res.json({
      success: true,
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

app.get('/newcollections', async (req, res) => {
  try {
    let products = await Product.find({});

    let newcollection = products.slice(-8); // ✅ simple & correct

    console.log("NewCollection Fetched");
    res.send(newcollection);

  } catch (error) {
    console.error("Error fetching new collection:", error);
    res.status(500).send("Server Error");
  }
});


// Popular in Women API
app.get('/popularinwomen', async (req, res) => {
  try {
    const products = await Product.find({ category: "women" });
    const popular_in_women = products.slice(0, 4);

    console.log("Popular in women fetched");
    res.json(popular_in_women);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});



const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).send({
      errors: "Please authenticate using valid token",
    });
  }

  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).send({
      errors: "Please authenticate using valid token",
    });
  }
};

app.post('/addtocart', fetchUser, async (req, res) => {
  try {
    console.log("Item ID:", req.body.itemId);

    // find user
    let userData = await Users.findOne({ _id: req.user.id });

    // safety check
    if (!userData.cartData[req.body.itemId]) {
      userData.cartData[req.body.itemId] = 0;
    }

    // increment item
    userData.cartData[req.body.itemId] += 1;

    // update DB
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );

    res.json({ success: true, message: "Added to cart" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


app.post('/removefromcart', fetchUser, async (req, res) => {
  try {
    console.log("Remove Item:", req.body.itemId);

    // find user
    let userData = await Users.findOne({ _id: req.user.id });

    // check if item exists and > 0
    if (userData.cartData[req.body.itemId] > 0) {
      userData.cartData[req.body.itemId] -= 1;
    }

    // update DB
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );

    res.json({ success: true, message: "Item removed" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
app.post('/getcart', fetchUser, async (req, res) => {
  try {
    console.log("GetCart");

    // find user
    let userData = await Users.findOne({ _id: req.user.id });

    // safety check
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      cart: userData.cartData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});



/* ================= SERVER ================= */
app.listen(port, () => {
  console.log("Server running on port " + port);
});