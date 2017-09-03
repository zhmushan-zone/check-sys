import { ManageComponent } from '../manage.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Code, User } from "../../share/model";
import { NzModalService } from "ng-zorro-antd";

@Component({
  selector: 'manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  validateForm: FormGroup;
  users: User[] = [{}];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private confirmServ: NzModalService,
    private _parent: ManageComponent
  ) {
  }

  ngOnInit() {

    this._parent.userService.list().subscribe(res => {
      let data = res.json();
      switch (data.code) {
        case Code.SUCCESS:
          this.users = data.users;
          break;
      }
    }, error => this._parent.handleError(error), () => this._parent.handleSuccess());

    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  register() {
    if (this.validateForm.valid) {
      let user: User = this.validateForm.value;
      this._parent.userService.register(user).subscribe(res => {
        let data = res.json();
        switch (data.code) {
          case Code.SUCCESS:
            this._parent.createNotification('success', '成功', '注册成功');
            this.users = [...this.users, ...[{
              username: user.username,
              privateTime: 0,
              publicTime: 0,
              lateTime: 0,
              totalTime: 0
            }]];
            this.validateForm.reset();
            localStorage.setItem('token', data.token);
            break;
          case Code.UNAUTHORIZED:
            this.router.navigate(['calendar']);
            break;
          case Code.USER_EXIST:
            this._parent.createNotification('error', '错误', '用户已存在');
            localStorage.setItem('token', data.token);
            break;
        }
      }, error => this._parent.handleError(error), () => this._parent.handleSuccess());
    } else {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
      }
    }
  }



  showDelete = (index) => {
    let username = this.users[index].username;
    this.confirmServ.confirm({
      title: `是否确认要删除用户:${username}`,
      onOk() {
        // console.log('确定');
      },
      onCancel() {
      }
    }).on('onOk', () => {
      // console.log(index)
      this._parent.userService.delete(username).subscribe(res => {
        let data = res.json();
        switch (data.code) {
          case Code.SUCCESS:
            localStorage.setItem('token', data.token);
            this.users.splice(index);
            this.users = [...this.users];
            break;
          case Code.UNAUTHORIZED:
            localStorage.removeItem('token');
            break;
        }
      }, error => this._parent.handleError(error), () => this._parent.handleSuccess());
    })
  }

  usersSortChange($event, key: string) {
    if ($event === 'ascend') {
      this.users = [...this.users.sort((a, b) => a[key] - b[key])];
    } else if ($event === 'descend') {
      this.users = [...this.users.sort((a, b) => b[key] - a[key])];
    }
  }
}
