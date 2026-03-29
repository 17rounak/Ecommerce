require("dotenv").config();

const express = require("express");
const app = express();

const port = process.env.PORT || 4000;

const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cors({ origin: "*" }));

/* ================= TEST ================= */
app.get("/test", (req, res) => {
  res.send("Working");
});

/* ================= DB ================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

/* ================= STATIC ================= */
app.use("/images", express.static("upload/images"));

/* ================= UPLOAD ================= */
app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  res.json({
    success: true,
    image_url: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
});

/* ================= PRODUCT MODEL ================= */
const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

const Product = mongoose.model("Product", productSchema);

/* ================= ADD PRODUCT ================= */
app.post("/addproduct", async (req, res) => {
  try {
    let id = 1;
    const lastProduct = await Product.findOne().sort({ id: -1 });
    if (lastProduct) id = lastProduct.id + 1;

    const product = new Product({ ...req.body, id });
    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving product",
    });
  }
});

/* ================= REMOVE PRODUCT ================= */
app.post("/removeproduct", async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.body.id });

    if (!deletedProduct) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({ success: true, deletedProduct });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
    });
  }
});

/* ================= ALL PRODUCTS ================= */
app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch {
    res.status(500).json({ success: false });
  }
});

/* ================= USER MODEL ================= */
const Users = mongoose.model("Users", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: Object,
  date: { type: Date, default: Date.now },
});

/* ================= SIGNUP ================= */
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    let existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "Email already exists",
      });
    }

    let cart = {};
    for (let i = 0; i < 300; i++) cart[i] = 0;

    const user = new Users({
      name: username,
      email,
      password,
      cartData: cart,
    });

    await user.save();

    const token = jwt.sign({ user: { id: user.id } }, "secret_ecom");

    res.json({ success: true, token });

  } catch (error) {
    console.log("SIGNUP ERROR:", error);
    res.json({
      success: false,
      message: "Server error",
    });
  }
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  try {
    let user = await Users.findOne({ email: req.body.email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (req.body.password !== user.password) {
      return res.json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ user: { id: user.id } }, "secret_ecom");

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* ================= AUTH ================= */
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Unauthorized");

  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

/* ================= CART ================= */
app.post("/addtocart", fetchUser, async (req, res) => {
  let user = await Users.findOne({ _id: req.user.id });
  user.cartData[req.body.itemId] += 1;

  await Users.findByIdAndUpdate(req.user.id, {
    cartData: user.cartData,
  });

  res.json({ success: true });
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  let user = await Users.findOne({ _id: req.user.id });

  if (user.cartData[req.body.itemId] > 0) {
    user.cartData[req.body.itemId] -= 1;
  }

  await Users.findByIdAndUpdate(req.user.id, {
    cartData: user.cartData,
  });

  res.json({ success: true });
});

app.post("/getcart", fetchUser, async (req, res) => {
  let user = await Users.findOne({ _id: req.user.id });
  res.json({ success: true, cart: user.cartData });
});

/* ================= EXTRA ================= */
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  res.send(products.slice(-8));
});

app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  res.json(products.slice(0, 4));
});

/* ================= SERVER ================= */
app.listen(port, () => {
  console.log("Server running on port " + port);
});