#  Ecommerce Web Application

A full-stack **Ecommerce platform** built using the MERN stack.
This application allows users to browse products, while admins can manage products through a dedicated dashboard.

---

##  Features

###  User Features

* Browse products
* View product details
* Responsive UI

###  Admin Features

* Add new products
* Remove products
* Manage product inventory

---

##  Tech Stack

### Frontend

* React.js
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Atlas)

---

##  Project Structure

```
Ecommerce/
 ├── frontend/   # React frontend
 ├── backend/    # Express server + APIs
 ├── admin/      # Admin dashboard
 ├── .gitignore
```

---

##  Installation & Setup

### 1️. Clone the repository

```bash
git clone https://github.com/17rounak/Ecommerce.git
cd Ecommerce
```

---

### 2️. Backend Setup

```bash
cd backend
npm install
npm start
```

---

### 3️. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

### 4️. Admin Panel Setup

```bash
cd admin
npm install
npm start
```

---

##  Environment Variables

Create a `.env` file in the backend folder:

```
MONGO_URI=your_mongodb_connection_string
PORT=4000
```

---

##  API Endpoints (Sample)

* `POST /addproduct` → Add a new product
* `POST /removeproduct` → Remove a product
* `GET /allproducts` → Fetch all products

---

##  Future Improvements

* User authentication (JWT)
* Payment integration (Stripe)
* Cart & checkout functionality
* Order tracking system

---

##  Contributing

Contributions are welcome!
Feel free to fork the repo and submit a pull request.


---

##  Author

**Rounak Handa**
