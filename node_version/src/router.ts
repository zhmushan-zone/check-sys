import * as Router from 'koa-router'
import { UserController } from './controller'

export const router = new Router({ prefix: '/api/user' })

router
  .post('/login', UserController.login)
  .post('/register', UserController.register)
  .get('/list', UserController.list)
  .post('/auth', UserController.auth)
  .post('/base-info', UserController.baseInfo)
  .post('/check', UserController.check)
  .post('/apply-private', UserController.applyPrivate)
  .get('/rank', UserController.rank)
  .post('/delete', UserController.delete)
  .post('/check-info', UserController.checkInfo)
  .post('/change-status', UserController.changeStatus)
