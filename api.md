# UsersApi

### 登录

```
GET /api/users/login
```

参数
```
username: "zhb",
password: "123456"
```

返回
```
{
    "code": 0,
    "msg": "成功",
    "data": {
        "user": {
            "username": "zhb",
            "role": 1
        }
        "token": "xxxxxxxxxxxxxxxxxxxxx"
    }
}
```

### 注册

```
POST /api/users/register
```

参数
```
username: "zhb",
password: "123456"
```

返回
```
{
    "code": 0,
    "msg": "成功"
}
```

### 列表

```
GET /api/users
```

参数
```
无
```

返回
```
{
    "code": 0,
    "msg": "成功",
    "data": {
        "users": [
            {
                "username": "zhb",
                "privateTime": 0,
                "publicTime": 0,
                "lateTime": 0,
                "totalTime": 0,
                "score": 0
            }
        ]
    }
}
```

### 验证

```
GET /api/users/auth
```

参数
```
无
```

返回
```
{
    "code": 0,
    "msg": "成功"，
    "data": {
        "user": {
            "username": "zhb",
            "role": 1
        }
        "token": "xxxxxxxxxxxxxxxxxx"
    }
}
```

### 基本信息

```
GET /api/users/:username
```

参数
```
无
```

返回
```
{
    "code": 0,
    "msg": "成功",
    "data": {
        "user": {
            "privateTime": 0,
            "publicTime": 0,
            "lateTime": 0,
            "totalTime": 0,
            "score": 0,
            "calendars": [
                {
                    "time": "2017-09-01",
                    "status": 0
                }
            ]
        }
    }
}
```

### 签到

```
POST /api/users/:username/calendars/check-in
```

参数
```
无
```

返回
```
{
    "code": 0,
    "msg": "成功",
    "data": {
        "calendar": {
            "time": "2017-09-01",
            "status": 1
        },
        "user": {
            "privateTime": 0,
            "publicTime": 0,
            "lateTime": 0,
            "totalTime": 0,
            "score": 0
        }
    }
}
```

### 申请私假

```
PATCH /api/users/:username/calendars/apply-leave
```

参数
```
date: new Date()
```

返回
```
{
    "code": 0,
    "msg": "成功",
    "data": {
        "calendar": {
            "time": "2017-09-01",
            "status": -2
        },
        "user": {
            "privateTime": 0,
            "publicTime": 0,
            "lateTime": 0,
            "totalTime": 0,
            "score": 0
        }
    }
}
```

### 删除

```
DELETE /api/users/:username
```

参数
```
无
```

返回
```
{
    "code": 0,
    "msg": "成功"
}
```

### 签到状态

```
GET /api/users/calendars/:time | YYYY-MM-DD
```

参数
```
无
```

返回
```
{
    "code": 0,
    "msg": "成功",
    "data": [
        {
            "user": {
                "username": "zhb"
            }
            "calendar": {
                "time": "2017-09-01",
                "status": 1
            }
        }
    ]
}
```

### 更改签到状态

```
PATCH /api/users/:username/calendar/:time | YYYY-MM-DD
```

参数
```
checkStatus: 1
```

返回
```
{
    "code": 0,
    "msg": "成功"
}
```