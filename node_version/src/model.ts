import { Document, Schema, model } from 'mongoose'

export interface IUser extends Document {
  username: string,
  password: string,
  role: number,
  score: number,
  calendar: any,
  privateTime: number,
  publicTime: number,
  lateTime: number,
  totalTime: number,
  checkStatus: number,
}

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true,
    default: 0,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  calendar: {
    type: {},
    default: {},
  },
  privateTime: {
    type: Number,
    required: true,
    default: 0,
  },
  lateTime: {
    type: Number,
    required: true,
    default: 0,
  },
  publicTime: {
    type: Number,
    required: true,
    default: 0,
  },
  totalTime: {
    type: Number,
    required: true,
    default: 0,
  },
})

export const User = model<IUser>('User', userSchema, 'users')
