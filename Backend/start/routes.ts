/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')
const ChannelsController = () => import('#controllers/channels_controller')
const MessagesController = () => import('#controllers/messages_controller')
const UsersController = () => import('#controllers/users_controller')

router.get('/', async () => 'It works!')

router.get('/api/data', async () => {
  return { message: 'Hello from AdonisJS' }
})

router.get('/api/ping', async ({ response }) => {
  response.status(200)
})

// Authentication
router.post('/api/register', [AuthController, 'register'])
router.post('/api/login', [AuthController, 'login'])
router.post('/api/logout', [AuthController, 'logout'])

//Verification
// eslint-disable-next-line prettier/prettier
router.get('/api/verifyToken', async ({ response }) => { response.status(200).json({ valid: true })})
router.get('/api/verifyTokenAndGetUser', async ({ auth }) => {
  const user = await auth.getUserOrFail()
  return { user: user }
})

router.get('/api/get-user-name', async ({ auth }) => {
  const user = await auth.getUserOrFail()
  return {
    success: true,
    firstName: user.firstName,
    lastName: user.lastName,
  }
})

router.get('/api/get-channels', [ChannelsController, 'getChats'])
router.post('/api/add-channel', [ChannelsController, 'addChannel'])
router.post('/api/leave-channel', [ChannelsController, 'leaveChannel'])
router.post('/api/accept-request', [ChannelsController, 'acceptRequest'])
router.post('/api/decline-request', [ChannelsController, 'declineRequest'])

router.get('/api/get-public-channels', [ChannelsController, 'getPublicChannels'])

router.post('/api/send-messages', [MessagesController, 'writeMessages'])

router.get('/api/get-user', [UsersController, 'getUser'])

router.post('/api/join-channel', [ChannelsController, 'joinChannel'])
router.post('/api/send-invite', [ChannelsController, 'sendInvite'])
router.post('/api/revoke-user', [ChannelsController, 'revokeUser'])
router.post('/api/kick-user', [ChannelsController, 'kickUser'])
