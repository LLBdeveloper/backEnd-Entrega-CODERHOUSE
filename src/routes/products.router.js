import express from "express";
const router = express.Router();

import ProductManager from "../controllers/products.manager.js";
const productManager = new ProductManager("./src/models/products.json");

//1) Retrieve all products.
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error("Error fetching products", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

//2) Retrieve a single product by id.
router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const product = await productManager.getProductById(parseInt(id));
        if (!product) {
            return res.json({
                error: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        console.error("Error fetching product", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

//3) Add a new product.
router.post("/", async (req, res) => {
    const newProduct = req.body;

    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({
            message: "Product added successfully"
        });
    } catch (error) {
        console.error("Error adding product", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

//4) Update by ID.
router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const updatedProduct = req.body;

    try {
        await productManager.updateProduct(parseInt(id), updatedProduct);
        res.json({
            message: "Product updated successfully"
        });
    } catch (error) {
        console.error("Error updating product", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

//5) Delete product.
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        await productManager.deleteProduct(parseInt(id));
        res.json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

export default router;
