const socket = io(); // conectamos el cliente con el server de websockets


// update-productos
const formProducto = document.getElementById('form-producto')
formProducto.addEventListener('submit', e => {
    e.preventDefault()

    const producto = { // aca guardo en el objeto producto los valores del form del index html
        nombre: document.getElementById('producto-nombre').value,
        precio: document.getElementById('producto-precio').value,
        url: document.getElementById('producto-url').value
    }

    socket.emit('update-productos', producto); // esto es para que lo escuche el servidor y le pasamos el objeto
    formProducto.reset()
})

// render-productos
socket.on('productos', manejarEventoProductos); // escucho el evento productos que recibo del server y recibo el array productos
    async function manejarEventoProductos(productos) {

        const recursoRemoto = await fetch('hbs/productos.hbs')
        const textoPlantilla = await recursoRemoto.text()
        const functionTemplate = Handlebars.compile(textoPlantilla)

        const html = functionTemplate({ productos })
        document.getElementById('productos').innerHTML = html // aca en 'productos(hbs)' le inyecto lo que tiene 'hbs/productos.hbs' pero actualizado y lo muestra por pantalla
}

// update-chat
const formChat = document.getElementById('form-chat')
formChat.addEventListener('submit', e => {
    e.preventDefault()

    const hora = new Date()

    const chat = {
        mail: document.getElementById('chat-mail').value,
        msg: document.getElementById('chat-msg').value,
        hora: '[' + hora.toLocaleString() + ']'
    }
    
    socket.emit('update-chat', chat);
    document.getElementById('chat-msg').value = ''
})

// render-chat
socket.on('chat', manejarEventoChat); // aca recibo los mensaje nuevos desde server ylo mismo que con product
async function manejarEventoChat(chat) {
    console.log(chat)

    const recursoRemoto = await fetch('hbs/chat.hbs')
    const textoPlantilla = await recursoRemoto.text()
    const functionTemplate = Handlebars.compile(textoPlantilla)

    const html = functionTemplate({ chat })
    document.getElementById('chat').innerHTML = html
}






