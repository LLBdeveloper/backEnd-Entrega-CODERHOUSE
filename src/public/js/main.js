const socket = io()

socket.on("productos", (data) =>{
    renderProductos(data)
})

//funcion para renderizar nuestros productos

const renderProductos = (data) => {
    const contenedorProductos = document.getElementById("contenedorProductos")
    contenedorProductos.innerHTML = ""

    data.forEach(item => {
        const card = document.createElement("div")
        card.innerHTML = `  
                            <p> ${item.id} </>
                            <p> ${item.title} </p>
                            <p> ${item.price} </>
                            <button> Eliminar </button>
        `
        contenedorProductos.appendChild(card)
        //agregamos evento al boton delete
        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id)
        })
    })
}

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id)
}