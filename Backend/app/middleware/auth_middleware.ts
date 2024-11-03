import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  private redirectTo = '/login'

  private excludedRoutes = ['/api/register', '/api/login', '/']

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    if (this.excludedRoutes.includes(ctx.request.url())) {
      await next()
      return
    }

    try {
      await ctx.auth.authenticateUsing(options.guards)
      await next()
    } catch (error) {
      ctx.response.status(401).json({
        error: 'Unauthorized',
        redirectTo: this.redirectTo,
      })
    }
  }
}
