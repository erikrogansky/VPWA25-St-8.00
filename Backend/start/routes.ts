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


router.get('/', async () => 'It works!')

router.get('/api/data', async () => {
  return { message: 'Hello from AdonisJS' }
})

router.post('/api/register', [AuthController, 'register'])
