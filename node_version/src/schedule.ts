import * as schedule from 'node-schedule'
import { User } from './model'
import { Util } from './util'

export class ScheduleJob {

  static myJob() {
    schedule.scheduleJob('0 0 18 * * 0-5', this.lateJob)
    schedule.scheduleJob('0 30 8 * * 6', this.lateJob)
  }

  private static async lateJob() {
    const users = await User.find({ role: 0 })
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    // const week = date.getDay()
    // const hour = date.getHours()
    // const minute = date.getMinutes()
    const key = `${year}-${Util.toDouble(month)}-${Util.toDouble(day)}`
    for (const user of users) {
      if (user.calendar[key] == null) {
        user.calendar[key] = -1
        await User.findOneAndUpdate({ username: user.username }, {
          calendar: user.calendar,
          score: user.score - 1,
          lateTime: user.lateTime + 1,
        })
      }
    }
  }
}
