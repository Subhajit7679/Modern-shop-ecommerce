# 🛍️ ModernShop - Full Stack MERN Ecommerce Platform

A fully featured Ecommerce web application built using the MERN Stack with secure authentication, admin dashboard, product management, cart, wishlist, coupon system, address management, order tracking, and Razorpay payment integration.

---

## 🚀 Live Demo

### Frontend
https://mordensop.vercel.app

### Backend API
https://modern-shop-backend-hlf9.onrender.com

---

## 📸 Features

### 👤 Customer Features

- User Registration & Login
- JWT Authentication
- Profile Management
- Address Management
- Product Search
- Product Filtering & Sorting
- Product Details Page
- Add to Cart
- Wishlist Management
- Coupon System
- Cash On Delivery (COD)
- Razorpay Online Payments
- Order Placement
- Order History
- Order Details Tracking
- Responsive Design

---

### 🛠️ Admin Features

- Admin Authentication
- Dashboard Panel
- Product Management (CRUD)
- Category Management (CRUD)
- Coupon Management
- Order Management
- Order Status Updates
- Inventory Management
- User Management

---

## 🏗️ Tech Stack

### Frontend

- React.js
- Vite
- React Router DOM
- Context API
- Tailwind CSS
- Axios
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js
- Razorpay Payment Gateway

### Deployment

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## 📂 Project Structure

```bash
Modern-shop-ecommerce/
│
├── modern-client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controller/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
(https://github.com/Subhajit7679/Modern-shop-ecommerce.git)

cd Modern-shop-ecommerce
```

---

### 2️⃣ Install Dependencies

#### Frontend

```bash
cd modern-client
npm install
```

#### Backend

```bash
cd server
npm install
```

---

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file inside the `server` folder:

```env
PORT=8000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY

RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY

RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_SECRET

CLIENT_URL=http://localhost:5173
```

---

### Frontend (.env)

Create a `.env` file inside the `modern-client` folder:

```env
VITE_API_URL=http://localhost:8000/api
```

---

## ▶️ Running Locally

### Start Backend

```bash
cd server
npm start
```

---

### Start Frontend

```bash
cd modern-client
npm run dev
```

---

## 🌐 Local URL

```bash
http://localhost:5173
```

---

## 👨‍💼 Admin Credentials (Demo)

Demo admin credentials available upon request.

## 💳 Payment Gateway

Integrated with:

- Razorpay Test Mode
- Cash On Delivery (COD)

---

## 📈 Future Improvements

- Product Reviews & Ratings(upgrade version)
- Email Verification
- 
- Cloudinary Image Upload
- Sales Analytics Dashboard

- Product Recommendations
- Multi Vendor Support

---

## 👨‍💻 Author

### Subhajit Maity

Full Stack Developer

GitHub:
https://github.com/Subhajit7679

LinkedIn:
(https://www.linkedin.com/in/subhajit-maity-9090a8253/)

---

## 📄 License

This project is developed for educational, portfolio, and learning purposes.

---

⭐ If you found this project useful, please consider giving it a star.
