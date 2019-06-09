import { Auth } from './jwt'
import * as Koa from 'koa'
import { User, IUser } from './model'
import { Util } from './util'

export class UserController {

  static async login(ctx: Koa.Context) {
    const { username, password } = ctx.request.body

    const user = await User.findOne({ username })

    if (user && (user.password === password)) {
      ctx.body = {
        'code': 0,
        'msg': '成功',
        'user': {
          'username': username,
          'role': user.role,
          'token': Auth.generateToken(user),
        },
      }
    } else {
      ctx.body = {
        'code': 1,
        'msg': '用户名或密码错误',
      }
    }
  }

  static async register(ctx: Koa.Context) {
    const { username, password, token } = ctx.request.body
    const admin: IUser = Auth.getUserFromToken(token)
    if (admin.role === 1) {
      try {
        await new User({
          username: username,
          password: password,
        }).save()
        ctx.body = {
          'code': 0,
          'msg': '成功',
          'token': Auth.generateToken(admin),
        }
      } catch (error) {
        ctx.body = {
          'code': 4,
          'msg': '用户已存在',
          'token': Auth.generateToken(admin),
        }
      }
    } else {
      ctx.body = {
        'code': 2,
        'msg': '非法用户',
      }
    }
  }

  static async list(ctx: Koa.Context) {
    const users = await User.find({ role: 0 }, [
      'username', 'privateTime', 'publicTime', 'lateTime', 'totalTime',
    ])
    ctx.body = {
      'code': 0,
      'msg': '成功',
      'users': users,
    }
  }

  static async auth(ctx: Koa.Context) {
    const { token } = ctx.request.body
    try {
      const user: IUser = Auth.getUserFromToken(token)
      ctx.body = {
        'code': 0,
        'msg': '成功',
        'user': {
          'username': user.username,
          'role': user.role,
        },
        'token': Auth.generateToken(user),
      }
    } catch (error) {
      ctx.body = {
        'code': 2,
        'msg': '非法用户',
      }
    }
  }

  static async baseInfo(ctx: Koa.Context) {
    const { token } = ctx.request.body
    try {
      let user: IUser | null = Auth.getUserFromToken(token)
      user = await User.findOne({ username: user.username })
      if (user) {
        ctx.body = {
          'code': 0,
          'msg': '成功',
          'user': {
            'username': user.username,
            'role': user.role,
            'privateTime': user.privateTime,
            'publicTime': user.publicTime,
            'lateTime': user.lateTime,
            'totalTime': user.totalTime,
            'calendar': user.calendar,
          },
          'token': Auth.generateToken(user),
        }
      }
    } catch (error) {
      ctx.body = {
        'code': 2,
        'msg': '非法用户',
      }
    }
  }

  static async check(ctx: Koa.Context) {
    const { token } = ctx.request.body
    try {
      let user: IUser | null = Auth.getUserFromToken(token)
      user = await User.findOne({ username: user.username, role: 0 })
      if (user) {
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const week = date.getDay()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const key = `${year}-${Util.toDouble(month)}-${Util.toDouble(day)}`
        let value
        if (user.calendar[key] == null && ((week !== 6 && hour === 17 && minute >= 30) || (week === 6 && hour === 8 && minute <= 30))) {
          value = 1
        } else {
          ctx.body = Util.handleError()
          return
        }
        user.calendar[key] = value
        await User.update({ username: user.username }, {
          calendar: user.calendar,
          totalTime: ++user.totalTime,
          score: user.score + value,
        })
        ctx.body = {
          'code': 0,
          'msg': '成功',
          'calendar': {
            'key': key,
            'value': value,
          },
          'user': {
            'totalTime': user.totalTime,
          },
          'token': Auth.generateToken(user),
        }
      }
    } catch (error) {
      ctx.body = {
        'code': 2,
        'msg': '非法用户',
      }
    }
  }

  static async applyPrivate(ctx: Koa.Context) {
    const { token, date: timestamps } = ctx.request.body
    const date = new Date(timestamps)
    try {
      let user: IUser | null = Auth.getUserFromToken(token)
      user = await User.findOne({ username: user.username, role: 0 })
      const key = `${date.getFullYear()}-${Util.toDouble(date.getMonth() + 1)}-${Util.toDouble(date.getDate())}`
      if (user && key) {
        switch (user.calendar[key]) {
          case -2:
            ctx.body = Util.handleError()
            return
          case -1:
            user.calendar[key] = -2
            user.score--
            user.lateTime--
            user.privateTime++
            break
          case 0:
            ctx.body = Util.handleError()
            return
          case 1:
            ctx.body = Util.handleError()
            return
          default:
            user.calendar[key] = -2
            user.score -= 2
            user.privateTime++
            user.totalTime++
        }
        await User.update({ username: user.username }, {
          calendar: user.calendar,
          score: user.score,
          lateTime: user.lateTime,
          totalTime: user.totalTime,
          privateTime: user.privateTime,
        })
        ctx.body = {
          'code': 0,
          'msg': '成功',
          'calendar': {
            'key': key,
            'value': -2,
          },
          'user': {
            'lateTime': user.lateTime,
            'privateTime': user.privateTime,
            'totalTime': user.totalTime,
          },
          'token': Auth.generateToken(user),
        }
      } else {
        ctx.body = Util.handleError()
      }
    } catch (error) {
      ctx.body = {
        'code': 2,
        'msg': '非法用户',
      }
    }
  }

  static async rank(ctx: Koa.Context) {
    const users = await User.find({ role: 0 }, [
      'username', 'score',
    ])
    users.sort((a, b) => b.score - a.score)
    ctx.body = {
      'code': 0,
      'msg': '成功',
      'users': users,
    }
  }

  static async delete(ctx: Koa.Context) {
    const { token, username } = ctx.request.body
    try {
      const admin: IUser = Auth.getUserFromToken(token)
      if (admin.role === 1) {
        await User.remove({ username: username, role: 0 })
        ctx.body = {
          'code': 0,
          'msg': '成功',
          'token': Auth.generateToken(admin),
        }
      } else {
        throw new Error()
      }
    } catch (error) {
      ctx.body = {
        'code': 2,
        'msg': '非法用户',
      }
    }

  }

  static async checkInfo(ctx: Koa.Context) {
    const { date: timestamps, token } = ctx.request.body

    const admin: IUser = Auth.getUserFromToken(token)
    if (admin.role === 1) {
      const date = new Date(timestamps)
      const key = `${date.getFullYear()}-${Util.toDouble(date.getMonth() + 1)}-${Util.toDouble(date.getDate())}`
      const users = await User.find({ role: 0 }, [
        'username', 'calendar',
      ])

      for (const i in users) {
        users[i] = {
          username: users[i].username,
          checkStatus: users[i].calendar[key] != null ? users[i].calendar[key] : 10,
        } as IUser
      }
      ctx.body = {
        'code': 0,
        'msg': '成功',
        'users': users,
        'token': Auth.generateToken(admin),
      }
    } else {
      ctx.body = {
        'code': 2,
        'msg': '非法用户',
      }
    }
  }

  static async changeStatus(ctx: Koa.Context) {
    const { token, checkStatus, username, date: timestamps } = ctx.request.body
    const date = new Date(timestamps)
    const calendarKey = `${date.getFullYear()}-${Util.toDouble(date.getMonth() + 1)}-${Util.toDouble(date.getDate())}`
    try {
      const admin: IUser = Auth.getUserFromToken(token)
      if (admin.role === 1 &&
        (checkStatus === -2
          || checkStatus === -1
          || checkStatus === 0
          || checkStatus === 1)) {
        const user: IUser | null = await User.findOne({ username: username }, ['calendar'])
        if (user) {
          user.calendar[calendarKey] = checkStatus
          let privateTime = 0
          let lateTime = 0
          let publicTime = 0
          let totalTime = 0
          let score = 0
          for (const i in user.calendar) {
            switch (user.calendar[i]) {
              case -2:
                privateTime++
                break
              case -1:
                lateTime++
                break
              case 0:
                publicTime++
                break
            }
            score += user.calendar[i]
            totalTime++
          }
          await User.update({ username: username }, {
            calendar: user.calendar,
            privateTime: privateTime,
            lateTime: lateTime,
            publicTime: publicTime,
            totalTime: totalTime,
            score: score,
          })
          ctx.body = {
            'code': 0,
            'msg': '成功',
            'user': {
              'checkStatus': checkStatus,
            },
            'token': Auth.generateToken(admin),
          }
        }
      } else {
        throw Error()
      }
    } catch (error) {
      ctx.body = {
        'code': 2,
        'msg': '非法用户',
      }
    }
  }
}
