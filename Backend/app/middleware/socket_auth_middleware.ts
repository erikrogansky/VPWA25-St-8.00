import axios from 'axios'
import { Socket } from 'socket.io'

export default class SocketAuthMiddleware {
  public async handle(socket: Socket, next: (err?: any) => void) {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        throw new Error('No token provided')
      }

      const response = await axios.get('http://localhost:3333/api/verifyTokenAndGetUser', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.user) {
        socket.data.user = response.data.user
        next()
      } else {
        throw new Error('Invalid token')
      }
    } catch (error) {
      console.error('Socket authentication error:', error.message)
      next(new Error('Authentication error'))
    }
  }
}
