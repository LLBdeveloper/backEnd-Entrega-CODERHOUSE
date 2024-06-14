import { promises as fs } from "fs";

class ProductManager {
    static lastId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            const productsArray = await this.readFile();

            if (!title || !description || !price || !code || !stock || !category) {
                console.log("All fields are mandatory");
                return;
            }

            if (productsArray.some(item => item.code === code)) {
                console.log("The code must be unique");
                return;
            }

            const newProduct = {
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            };

            if (productsArray.length > 0) {
                ProductManager.lastId = productsArray.reduce((maxId, product) => Math.max(maxId, product.id), 0);
            }

            newProduct.id = ++ProductManager.lastId;

            productsArray.push(newProduct);
            await this.saveFile(productsArray);
        } catch (error) {
            console.log("Error adding product", error);
            throw error;
        }
    }

    async getProducts() {
        try {
            const productsArray = await this.readFile();
            return productsArray;
        } catch (error) {
            console.log("Error reading file", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const productsArray = await this.readFile();
            const found = productsArray.find(item => item.id === id);

            if (!found) {
                console.log("Product not found");
                return null;
            } else {
                console.log("Product found");
                return found;
            }
        } catch (error) {
            console.log("Error reading file", error);
            throw error;
        }
    }

    async readFile() {
        try {
            const response = await fs.readFile(this.path, "utf-8");
            const productsArray = JSON.parse(response);
            return productsArray;
        } catch (error) {
            console.log("Error reading a file", error);
            throw error;
        }
    }

    async saveFile(productsArray) {
        try {
            await fs.writeFile(this.path, JSON.stringify(productsArray, null, 2));
        } catch (error) {
            console.log("Error saving file", error);
            throw error;
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const productsArray = await this.readFile();

            const index = productsArray.findIndex(item => item.id === id);

            if (index !== -1) {
                productsArray[index] = { ...productsArray[index], ...updatedProduct };
                await this.saveFile(productsArray);
                console.log("Product updated");
            } else {
                console.log("Product not found");
            }
        } catch (error) {
            console.log("Error updating product", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const productsArray = await this.readFile();

            const index = productsArray.findIndex(item => item.id === id);

            if (index !== -1) {
                productsArray.splice(index, 1);
                await this.saveFile(productsArray);
                console.log("Product deleted");
            } else {
                console.log("Product not found");
            }
        } catch (error) {
            console.log("Error deleting product", error);
            throw error;
        }
    }
}

export default ProductManager;
