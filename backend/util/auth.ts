import { User } from "../user/model.ts";

export function generateToken(user: User) {
  const u = { username: user.username, role: user.role };
  return JSON.stringify(u);
}

export function getUserFromToken(token: string) {
  return JSON.parse(token) as User;
}
