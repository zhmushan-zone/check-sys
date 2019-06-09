import * as koa from 'koa'
import * as koaBodyparser from 'koa-bodyparser'
import * as mongoose from 'mongoose'
import { router } from './router'
import { ScheduleJob } from './schedule'
import * as koaStatic from 'koa-static'
import * as path from 'path'
const cors = require('koa2-cors')

mongoose.connect('mongodb://localhost/check_sys')

const app = new koa()

ScheduleJob.myJob()

app.use(koaStatic(path.join(__dirname, '../static')))

app.use(cors())

app.use(koaBodyparser())

app.use(router.routes())

app.listen(3000)
console.log('[demo] start-quick is starting at port 3000')
