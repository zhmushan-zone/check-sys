export interface User {
    username?: string;
    password?: string;
    role?: number;
    remember?: boolean;
    privateTime?: number;
    publicTime?: number;
    lateTime?: number;
    totalTime?: number;
    score?: number;
    checkStatus?: number
}

export enum UserRole {
    USER,
    ADMIN
}

export enum Code {
    SUCCESS,//成功
    USERNAME_OR_PASSWARD_WRONG,//用户名或密码错误
    UNAUTHORIZED,//非法用户
    OPERATION_WRONG,//操作错误
    USER_EXIST,//用户已存在
}

export enum CheckStatus {
    PRIVATE = -2,//私假
    LATE,//迟到
    PUBLIC,//公假
    ON_TIME,//准时
    NONE = 10,//未签到
}