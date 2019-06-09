import { HandlerFunc, Context } from "../deps.ts";
import { app } from "../mod.ts";
import {
  list,
  rank,
  login,
  register,
  auth,
  baseInfo,
  check,
  applyPrivate,
  deleteOne,
  checkInfo,
  changeStatus
} from "./handlers.ts";

export const g = app
  .group("/api/user")
  .get("/list", list)
  .get("/rank", rank)
  .post("/login", login)
  .post("/register", register)
  .post("/auth", auth)
  .post("/base-info", baseInfo)
  .post("/check", check)
  .post("/apply-private", applyPrivate)
  .post("/delete", deleteOne)
  .post("/check-info", checkInfo)
  .post("/change-status", changeStatus);
