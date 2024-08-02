import express from "express"
import {engine} from "express-handlebars"
import {Server} from "socket.io"
import displayRoutes from 'express-routemap'
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js"
import ProductManager from "./controllers/products.manager.js"

const app = express()
const PUERTO = 8080
const productManager = new ProductManager("./src/models/products.json")


//Middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/static", express.static("./src/public"));

//Handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

//Rutas
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)


//Listen
const httpServer = app.listen(PUERTO, () => {
    displayRoutes(app)
    console.log('/// escuchando en el puerto 8080 ///')
})

//Socket.io
const io = new Server(httpServer)
io.on("connection", async (socket)=>{
    console.log("+++ New connection SOCKET.IO +++ ")
    socket.emit("productos", await productManager.getProducts())
    socket.on("eliminarProducto", async (id)=>{
        await productManager.deleteProduct(id)
        io.sockets.emit("productos", await productManager.getProducts())
    })
    socket.on("agregarProducto", async (producto) =>{
        await productManager.addProduct(producto)
        io.sockets.emit("productos", await productManager.getProducts())
    })
})
