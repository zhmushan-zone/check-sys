import { Context } from "../deps.ts";
import { UserLoginDto, UserRegisterDto } from "./dto.ts";
import { User } from "./model.ts";
import { getUserFromToken, generateToken } from "../util/auth.ts";
import { toDouble } from "../util/date.ts";

const userdb: Map<string, User> = new Map();
userdb.set("admin", { username: "admin", password: "admin", role: 1 });

export function list(c: Context) {
  const users = Array.from(userdb.values())
    .filter(u => u.role === 0)
    .map<User>(u => {
      return {
        username: u.username,
        privateTime: u.privateTime,
        publicTime: u.publicTime,
        lateTime: u.lateTime,
        totalTime: u.totalTime
      };
    });
  return { code: 0, users };
}

export function rank(c: Context) {
  const users = Array.from(userdb.values())
    .filter(u => u.role === 0)
    .map<User>(u => ({
      username: u.username,
      score: u.score
    }));
  users.sort((a, b) => b.score - a.score);
  return { code: 0, users };
}

export async function login(c: Context) {
  const dto = await c.bind(UserLoginDto);
  const user = userdb.get(dto.username);
  if (user && user.password === dto.password) {
    return {
      code: 0,
      user: {
        username: user.username,
        role: user.role,
        token: generateToken(user)
      }
    };
  }
  return { code: 1 };
}

export async function register(c: Context) {
  const dto = await c.bind(UserRegisterDto);
  const admin = getUserFromToken(dto.token);
  if (admin.role === 1) {
    let code = 4;
    if (!userdb.has(dto.username)) {
      userdb.set(dto.username, {
        username: dto.username,
        password: dto.password,
        role: 0,
        score: 0,
        calendar: {},
        privateTime: 0,
        lateTime: 0,
        publicTime: 0,
        totalTime: 0
      });
      code = 1;
    }
    return { code, token: dto.token };
  }
  return { code: 2 };
}

export async function auth(c: Context) {
  const { token } = await c.body();
  try {
    const user = getUserFromToken(token);
    return { code: 0, user, token };
  } catch {
    return { code: 2 };
  }
}

export async function baseInfo(c: Context) {
  const { token } = await c.body();
  try {
    let user = getUserFromToken(token);
    user = userdb.get(user.username);
    if (user) {
      return {
        code: 0,
        user: {
          username: user.username,
          role: user.role,
          privateTime: user.privateTime,
          publicTime: user.publicTime,
          lateTime: user.lateTime,
          totalTime: user.totalTime,
          calendar: user.calendar
        },
        token
      };
    }
  } catch {
    return { code: 2 };
  }
}

export async function check(c: Context) {
  const { token } = await c.body();
  try {
    let user = getUserFromToken(token);
    user = userdb.get(user.username);
    if (user) {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const week = date.getDay();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const key = `${year}-${toDouble(month)}-${toDouble(day)}`;
      let value;
      if (
        user.calendar[key] == null &&
        ((week !== 6 && hour === 17 && minute >= 30) ||
          (week === 6 && hour === 8 && minute <= 30))
      ) {
        value = 1;
      } else {
        return { code: 3 };
      }
      user.calendar[key] = value;
      ++user.totalTime;
      user.score + value;
      userdb.set(user.username, user);

      return {
        code: 0,
        calendar: {
          key: key,
          value: value
        },
        user: {
          totalTime: user.totalTime
        },
        token
      };
    }
  } catch {
    return { code: 2 };
  }
}

export async function applyPrivate(c: Context) {
  const { token, date: timestamps } = await c.body();
  const date = new Date(timestamps);
  try {
    let user = getUserFromToken(token);
    user = userdb.get(user.username);
    const key = `${date.getFullYear()}-${toDouble(
      date.getMonth() + 1
    )}-${toDouble(date.getDate())}`;
    if (user && key) {
      switch (user.calendar[key]) {
        case -1:
          user.calendar[key] = -2;
          user.score--;
          user.lateTime--;
          user.privateTime++;
          break;
        case -2:
        case 0:
        case 1:
          return { code: 3 };
        default:
          user.calendar[key] = -2;
          user.score -= 2;
          user.privateTime++;
          user.totalTime++;
      }
      userdb.set(user.username, user);
      return {
        code: 0,
        calendar: {
          key: key,
          value: -2
        },
        user: {
          lateTime: user.lateTime,
          privateTime: user.privateTime,
          totalTime: user.totalTime
        },
        token: token
      };
    } else {
      return { code: 3 };
    }
  } catch {
    return { code: 2 };
  }
}

export async function deleteOne(c: Context) {
  const { token, username } = await c.body();
  try {
    const admin = getUserFromToken(token);
    if (admin.role === 1) {
      userdb.delete(username);
      return { code: 0, token };
    } else {
      throw new Error();
    }
  } catch {
    return { code: 2 };
  }
}

export async function checkInfo(c: Context) {
  const { date: timestamps, token } = await c.body();

  const admin = getUserFromToken(token);
  if (admin.role === 1) {
    const date = new Date(timestamps);
    const key = `${date.getFullYear()}-${toDouble(
      date.getMonth() + 1
    )}-${toDouble(date.getDate())}`;
    const users = Array.from(userdb.values())
      .filter(u => u.role === 0)
      .map<User>(u => ({
        username: u.username,
        calendar: u.calendar
      }));

    for (const i in users) {
      users[i] = {
        username: users[i].username,
        checkStatus:
          users[i].calendar[key] != null ? users[i].calendar[key] : 10
      };
    }
    return { code: 0, users, token };
  } else {
    return { code: 2 };
  }
}

export async function changeStatus(c: Context) {
  const { token, checkStatus, username, date: timestamps } = await c.body();
  const date = new Date(timestamps);
  const calendarKey = `${date.getFullYear()}-${toDouble(
    date.getMonth() + 1
  )}-${toDouble(date.getDate())}`;
  try {
    const admin = getUserFromToken(token);
    if (
      admin.role === 1 &&
      (checkStatus === -2 ||
        checkStatus === -1 ||
        checkStatus === 0 ||
        checkStatus === 1)
    ) {
      const user = userdb.get(username);
      if (user) {
        user.calendar[calendarKey] = checkStatus;
        let privateTime = 0;
        let lateTime = 0;
        let publicTime = 0;
        let totalTime = 0;
        let score = 0;
        for (const i in user.calendar) {
          switch (user.calendar[i]) {
            case -2:
              privateTime++;
              break;
            case -1:
              lateTime++;
              break;
            case 0:
              publicTime++;
              break;
          }
          score += user.calendar[i];
          totalTime++;
        }
        user.privateTime = privateTime;
        user.lateTime = lateTime;
        user.publicTime = publicTime;
        user.totalTime = totalTime;
        user.score = score;
        userdb.set(username, user);
        return {
          code: 0,
          user: {
            checkStatus: checkStatus
          },
          token: generateToken(admin)
        };
      }
    } else {
      throw Error();
    }
  } catch (error) {
    return { code: 2 };
  }
}
