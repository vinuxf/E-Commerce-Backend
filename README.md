# 🇨🇦 CanadaE-Commerce Backend

![Node.js](https://img.shields.io/badge/Node.js-16.x-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey?style=for-the-badge&logo=express)
![MySQL](https://img.shields.io/badge/MySQL-8.x-blue?style=for-the-badge&logo=mysql)

🚀 **CanadaE-Commerce Backend** is a robust backend service built with **Node.js, Express, and MySQL**. It powers a fully functional e-commerce platform, complete with **shopping cart, payment gateway integration, order management, and user authentication.**

---

## 📥 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/CanadaEcommerceBackend.git
cd CanadaEcommerceBackend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory and add:
```env
PORT=3000
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_secret_key
```

### 4️⃣ Start the Server
```bash
npm start
```
Server will run at `http://localhost:3000/`

---

## ⚙️ Features
✅ **User Authentication** (Register/Login with JWT)  
✅ **Shopping Cart** (Add, Remove, Update Items)  
✅ **Product Management** (CRUD for products)  
✅ **Payment Integration** (Stripe/PayPal)  
✅ **Order Processing** (Checkout & Order History)  
✅ **Admin Dashboard** (Manage Users, Orders, Inventory)  

---

## 📌 API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | User login |
| `GET` | `/api/products` | Get all products |
| `POST` | `/api/cart/add` | Add item to cart |
| `POST` | `/api/order/checkout` | Checkout order |
| `GET` | `/api/admin/orders` | View all orders (Admin) |

_For a full API documentation, check the Postman collection._

---

## 🏗 Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateways**: Stripe, PayPal
- **Other Tools**: dotenv, bcrypt, multer

---

## 🤝 Contributing
Pull requests are welcome! Feel free to submit any improvements, fixes, or new features.

---

## 📜 License
This project is open-source and available under the **MIT License**.

---

## 📞 Contact
📧 **Email**: vihangafernando729@gmail.com  
 

---

Happy Coding! 🚀🎉

