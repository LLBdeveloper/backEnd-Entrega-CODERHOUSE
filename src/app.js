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

const httpServer = app.listen(PUERTO, () => {
    displayRoutes(app)
    console.log('escuchando en el puerto 8080')
})


const productManager = new ProductManager("./src/models/products.json")

const io = new Server(httpServer)

io.on("connection", async (socket)=>{
    console.log("un cliente se conecto")

    //enviamos el array de productos
    socket.emit("productos", await productManager.getProducts())

    //recibimos el evento eliminarProductos desde el cliente
    socket.on("eliminarProducto", async (id)=>{
        await productManager.deleteProduct(id)

        //le voy a enviar la lista actualizada al cliente
        //se utiliza io.sockets.emit en lugar de socket.emit io.sockets.emit envía el evento a todos los clientes conectados, mientras que socket.emit envía el evento solo al cliente específico que se conectó.
        io.sockets.emit("productos", await productManager.getProducts())
    })
})