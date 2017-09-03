import * as Router from 'koa-router';
import userController from './controller'

export const router: Router = new Router();

router
    .post('/user/login', userController.login)
    .post('/user/register', userController.register)
    .get('/user/list', userController.list)
    .post('/user/auth', userController.auth)
    .post('/user/base-info', userController.baseInfo)
    .post('/user/check', userController.check)
    .post('/user/apply-private', userController.applyPrivate)
    .get('/user/rank', userController.rank)
    .post('/user/delete', userController.delete)
    .post('/user/check-info', userController.checkInfo)
    .post('/user/change-status', userController.changeStatus)
// router
//     .get('/api/users/login', UserController.login)   // 登录
//     .post('/api/users/register', UserController.register)   // 注册
//     .get('/api/users', UserController.list) // 列表
//     .get('/api/users/auth', UserController.auth)    // 验证
//     .get('/api/users/:username', UserController.baseInfo)    // 基本信息
//     .post('/api/users/:username/calendars/check-in', UserController.checkIn)    // 签到
//     .patch('/api/users/:username/calendars/apply-leave', UserController.applyLeave) // 申请私假
//     .delete('/api/users/:username', UserController.deleteOne)   // 删除用户
//     .get('/api/users/calendars/:time', UserController.checkStatus)  // 签到状态
//     .patch('/api/users/:username/calendars/:time', UserController.changeCheckStatus)    // 更改签到状态