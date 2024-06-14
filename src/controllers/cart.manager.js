import { promises as fs } from "fs";

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.lastId = 0;

        // Load the carts stored in the file
        this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, "utf8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                // Check if at least one cart is created:
                this.lastId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.error("Error loading carts from file", error);
            // If the file does not exist, create it.
            await this.saveCarts();
        }
    }

    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createCart() {
        const newCart = {
            id: ++this.lastId,
            products: []
        };

        this.carts.push(newCart);

        // Save the array to the file
        await this.saveCarts();
        return newCart;
    }

    async getCartById(cartId) {
        try {
            const cart = this.carts.find(c => c.id === cartId);

            if (!cart) {
                throw new Error(`No cart found with id ${cartId}`);
            }

            return cart;
        } catch (error) {
            console.error("Error getting cart by ID", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        const existingProduct = cart.products.find(p => p.product === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await this.saveCarts();
        return cart;
    }
}

export default CartManager;
