import app from '@adonisjs/core/services/app'
import { Server } from 'socket.io'
import server from '@adonisjs/core/services/server'
import MessagesController from '#controllers/messages_controller'
import SocketAuthMiddleware from '#middleware/socket_auth_middleware'
const messagesController = new MessagesController()
const socketAuthMiddleware = new SocketAuthMiddleware()
import Channel from '#models/channel'
import UserChannelMembership from '#models/user_channel_membership'

let io: Server

app.ready(() => {
  io = new Server(server.getNodeServer(), {
    cors: {
      origin: 'http://localhost:9000',
    },
  })

  io.use((socket, next) => socketAuthMiddleware.handle(socket, next))

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {})

    socket.on('acknowledgment', (data) => {
      console.log('Acknowledgment received:', data)
    })

    socket.on('fetchMessages', async (data) => {
      data.user = socket.data.user
      try {
        const messages = await messagesController.getMessages(data)
        socket.emit('messages', messages)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    })

    socket.on('subscribeToMessages', async (data) => {
      try {
        const results = await Channel.query()
          .where('name', data.title)
          .orWhere('nameIfChat', data.title)
          .firstOrFail()
        socket.join(results.name)
      } catch (error) {
        if (error.code === 'E_ROW_NOT_FOUND') {
          console.error('Channel not found:', data.title)
        } else {
          console.error('Error subscribing to messages:', error)
        }
      }
    })

    socket.on('subscribeToAllChannels', async (data) => {
      const user = socket.data.user
      const memberships = await UserChannelMembership.query()
        .where('userId', user.id)
        .preload('channel')

      try {
        const channels = memberships.map((membership) => membership.channel)
        for (const channel of channels) {
          socket.join(channel.name)
        }

        socket.join(user.nick + '-account')
      } catch (error) {
        console.error('Error subscribing to all channels:', error)
      }
    })

    socket.on('isTypingText', async (data) => {
      const user = socket.data.user
      const results = await Channel.query()
        .where('name', data.title)
        .orWhere('nameIfChat', data.title)
        .firstOrFail()
      socket.to(results.name).emit('isTypingText', { text: data.text, nick: user.nick })
    })

    socket.on('stoppedTyping', async (data) => {
      const results = await Channel.query()
        .where('name', data.title)
        .orWhere('nameIfChat', data.title)
        .firstOrFail()
      socket.to(results.name).emit('stoppedTyping')
    })

    socket.on('unsubscribeFromMessages', async (data) => {
      // eslint-disable-next-line prettier/prettier
      const results = await Channel.query().where('name', data.title).orWhere('nameIfChat', data.title).firstOrFail()
      socket.leave(results.name)
    })
  })
})

export { io }
