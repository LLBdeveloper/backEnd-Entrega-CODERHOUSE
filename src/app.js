import express from "express"
import displayRoutes from 'express-routemap'
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"


const app = express()
const PUERTO = 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.listen(PUERTO, () => {
    displayRoutes(app)
    console.log('escuchando en el puerto 8080')
})


app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)



app.use("/static", express.static("./src/public"))