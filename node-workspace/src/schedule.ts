import * as schedule from 'node-schedule';
import { default as userService, User } from './model';
import { Util } from "./util";

export class ScheduleJob {

    static aaaa() {
        let rule = new schedule.RecurrenceRule();
        let times = [];

        for (let i = 1; i < 60; i++) {
            times.push(i);
        }

        rule.second = times;

        let c = 0;
        let j = schedule.scheduleJob(rule, function () {
            c++;
            console.log(c);
        });
    }

    static myJob() {
        schedule.scheduleJob('0 0 18 * * 0-5', this.lateJob);
        schedule.scheduleJob('0 30 8 * * 6', this.lateJob);
    }

    private static async lateJob() {
        let users: Array<User> = <Array<any>>await userService.find({ role: 0 });
        //  console.log(users);
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let week = date.getDay();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let key = `${year}-${Util.toDouble(month)}-${Util.toDouble(day)}`;
        for (let user of users) {
            // console.log(user)
            if (user.calendar[key] == null) {
                user.calendar[key] = -1;
                await userService.findOneAndUpdate({ username: user.username }, {
                    calendar: user.calendar,
                    score: user.score - 1,
                    lateTime: user.lateTime + 1
                });
            }
        }
    }
}