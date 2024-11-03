import app from '@adonisjs/core/services/app'
import { Server } from 'socket.io'
import server from '@adonisjs/core/services/server'

app.ready(() => {
  const io = new Server(server.getNodeServer(), {
    cors: {
      origin: 'http://localhost:9000',
    },
  })

  io.on('connection', (socket) => {
    console.log('A new connection', socket.id)

    socket.on('message', (data) => {
      console.log('Received message:', data)
      socket.broadcast.emit('message', data)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id)
    })
  })
})
