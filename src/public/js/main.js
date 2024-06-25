

const socket = io()

console.log('sii funciona')


socket.on("productos", (data) =>{
    renderProductos(data)
})

//funcion para renderizar nuestros productos

const renderProductos = (data) => {
    const contenedorProductos = document.getElementById("contenedorProductos")
    
    data.forEach(item => {
        const card = document.createElement("div")
        card.innerHTML = `  
                            <p> ${item.id} </>
                            <p> ${item.title} </p>
                            <p> ${item.price} </>
                            <button> Eliminar </button>
        `
        contenedorProductos.appendChild(card)
    })
}