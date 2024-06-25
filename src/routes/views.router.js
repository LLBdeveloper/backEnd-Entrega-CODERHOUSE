import {Router} from "express"
import fs from "fs";
import path from "path";


const router = Router()


router.get("/", (req, res) => {
    const productsFilePath = path.resolve("src/models/products.json");

    fs.readFile(productsFilePath, "utf-8", (err, data) => {
        if (err) {
            console.error("Error reading products file:", err);
            return res.status(500).send("Error reading products file");
        }

        const products = JSON.parse(data);
        res.render("home", { products });
    });
});

router.get("/realtimeproducts", async (req, res) =>{
    res.render("realtimeproducts")
})


export default router