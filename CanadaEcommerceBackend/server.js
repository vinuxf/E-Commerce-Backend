const express = require("express");
const db = require("./db/db");
const app = express();
const cors = require("cors");
const port = 8000;
const bodyParser = require("body-parser");
const path = require("path");
const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(express.json());
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authenticationRoutes = require("./routes/authRoutes");
const productCategoryRoutes = require("./routes/productCategoryRoutes");
const featuredEventRoutes = require("./routes/featuredCategoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const toolRoutes = require("./routes/toolRoutes");
const emailRoutes = require("./routes/emailRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const category2Routes = require("./routes/international/categoryRoutes");
const product2Routes = require("./routes/international/productRoutes");
const productImagesRoutes = require("./routes/international/productImagesRoutes");
const quoteRoutes = require("./routes/international/quoteRoutes");

app.use("/product-images", express.static("productImages"));
app.use("/productImagesInternational", express.static("productImagesInternational"));
app.use("/product-category-images", express.static("productCategoryImages"));
app.use("/api/authentication", authenticationRoutes);
app.use("/api/product-category", productCategoryRoutes);
app.use("/api/featured-category", featuredEventRoutes);
app.use("/api/products", productRoutes);
app.use("/api/oders", orderRoutes);
app.use("/api/tools", toolRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/sub-category", subCategoryRoutes);
app.use("/api/international/categories", category2Routes);
app.use("/api/international/products", product2Routes);
app.use("/api/international/product-images", productImagesRoutes);
app.use("/api/international/quotes", quoteRoutes);

app.listen(port, () => {
  console.log(`The backend is running on port number ${port}`);
});
