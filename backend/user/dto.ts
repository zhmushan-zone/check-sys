import { Binder } from "../deps.ts";

@Binder()
export class UserLoginDto {
  constructor(readonly username: string, readonly password: string) {}
}

@Binder()
export class UserRegisterDto {
  constructor(
    readonly username: string,
    readonly password: string,
    readonly token: string
  ) {}
}
