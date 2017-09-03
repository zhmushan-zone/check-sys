import * as Koa from 'koa';
import * as cors from 'koa2-cors';
import * as bodyparser from 'koa-bodyparser';
import * as mongoose from 'mongoose';
import { router } from './router';
import { ScheduleJob } from "./schedule";

mongoose.connect('mongodb://localhost/check_sys', {
    useMongoClient: true,
});

const app: Koa = new Koa();

ScheduleJob.myJob();

app.use(cors());

app.use(bodyparser());

app.use(router.routes());

app.listen(3000);
console.log('[demo] start-quick is starting at port 3000');