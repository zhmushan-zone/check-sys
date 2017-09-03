import { User } from './model';
import * as jwt from 'jsonwebtoken';

export class Auth {

    private static JWT_SECRET: string = "7786df7fc3a34e26a61c034d5ec8245d";

    /**
     * 生成token
     */
    public static generateToken(user: User) {
        return jwt.sign({
            sub: this.generateSubject(user),
            exp: Math.floor(Date.now() / 1000) + (60 * 30)
        }, this.JWT_SECRET)
    }

    /**
     * 将 token 转为 User
     */
    public static getUserFromToken(token: string): User {
        return JSON.parse(jwt.verify(token, this.JWT_SECRET).sub);
    }

    // /**
    //  * 刷新token
    //  */
    // public static String refreshToken(String token) {
    //     return generateToken(getUserFromToken(token));
    // }

    /**
     * 生成subject
     */
    private static generateSubject(user: User): string {
        return JSON.stringify({
            'username': user.username,
            'role': user.role
        })
    }
}