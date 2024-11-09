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

router.get('/', async () => 'It works!')

router.get('/api/data', async () => {
  return { message: 'Hello from AdonisJS' }
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
router.post('/api/accept-request', [ChannelsController, 'acceptRequest'])

router.post('/api/send-messages', [MessagesController, 'writeMessages'])
