import server from '@adonisjs/core/services/server'
import { Server as SocketIoServer } from 'socket.io'

const io = new SocketIoServer(server)

io.on('connection', (socket) => {
  console.log('New client connected', socket.id)

  socket.on('message', (data) => {
    console.log('Message received:', data)
    socket.broadcast.emit('message', data)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id)
  })
})
