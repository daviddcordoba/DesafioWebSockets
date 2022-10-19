
// Clase contenedor para los mensajes
const Contenedor = require('./clase-contenedor.js');
const chatTxt = new Contenedor('./src/chat.txt')


const express = require('express')
const app = express()


const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const productos = []
// const chat = []


//--------------------------------------------
// configuracion del socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');


    // Productos
    socket.emit('productos', productos);
    socket.on('update-productos', e => { // aca estoy escuchando evento y recibo en e los datos del producto osea e = productos(objeto)
        productos.push(e) // aca pusheo e en el array de productos de arriba
        io.sockets.emit('productos', productos);// aca estoy mandando en 'productos(hbs)' y le mando el array productos
    })


    // Chat
    socket.emit('chat', await chatTxt.getAll()); // aca primero espero a recibir algo del chat.txt
    socket.on('update-chat', async e => { // aca digo bueno voy a estar esuchando el evento 'update-chat' , luego espero a que se guarde el nuevo mensaje y mando a 'chat' la nueva info
        await chatTxt.save(e)
        io.sockets.emit('chat', await chatTxt.getAll());
    })


});

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
