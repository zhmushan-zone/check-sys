import * as mongoose from 'mongoose';

let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true,
        default: 0
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
    calendar: {
        type: {},
        default: {}
    },
    privateTime: {
        type: Number,
        required: true,
        default: 0
    },
    lateTime: {
        type: Number,
        required: true,
        default: 0
    },
    publicTime: {
        type: Number,
        required: true,
        default: 0
    },
    totalTime: {
        type: Number,
        required: true,
        default: 0
    }
})

export default mongoose.model('User', UserSchema);

export interface User {
    username: string,
    password: string,
    role: number,
    score: number,
    calendar: any,
    privateTime: number,
    publicTime: number,
    lateTime: number,
    totalTime: number,
    checkStatus: number
}

// User.statics = {
//     findByUsernameAndPassword: function (username: string, password: string) {
//         return this.findByUsernameAndPassword
//     }
// }