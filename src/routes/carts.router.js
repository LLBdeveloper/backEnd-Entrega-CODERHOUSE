import express from "express";
import CartManager from "../controllers/cart.manager.js";

const router = express.Router();
const cartManager = new CartManager("./src/models/carts.json");

//1) Create a new cart:
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.error("Error creating a new cart", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//2) List products belonging to a specific cart.
router.get("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);

    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        console.error("Error retrieving cart", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//3) Add products to different carts.
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updatedCart.products);
    } catch (error) {
        console.error("Error adding product to cart", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
