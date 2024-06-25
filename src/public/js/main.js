import ProductManager from "../controllers/products.manager.js";
const productManager = new ProductManager("./src/models/products.json");

const products = document.getElementById("allProducts")

