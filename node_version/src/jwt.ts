import { IUser } from './model'
import * as jwt from 'jsonwebtoken'

export class Auth {

  private static JWT_SECRET = '7786df7fc3a34e26a61c034d5ec8245d'

  public static generateToken(user: IUser) {
    return jwt.sign(
      this.generateSubject(user),
      this.JWT_SECRET,
    )
  }

  public static getUserFromToken(token: string) {
    return jwt.verify(token, this.JWT_SECRET) as IUser
  }

  private static generateSubject(user: IUser) {
    return {
      'username': user.username,
      'role': user.role,
    } as IUser
  }
}
