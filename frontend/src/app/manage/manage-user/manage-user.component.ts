import { ManageComponent } from '../manage.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Code, User } from '../../share/model';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  validateForm: FormGroup;
  users: User[] = [{}];

  submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      const user: User = this.validateForm.value;
      console.log(user);
      this._parent.userService.register(user).subscribe(res => {
        const data = res.json();
        switch (data.code) {
          case Code.SUCCESS:
            this._parent.createNotification('success', '成功', '注册成功');
            this.users = [{
              username: user.username,
              privateTime: 0,
              publicTime: 0,
              lateTime: 0,
              totalTime: 0
            }, ...this.users];
            this.validateForm.reset();
            localStorage.setItem('token', data.token);
            break;
          case Code.UNAUTHORIZED:
            this.router.navigate(['calendar']);
            break;
          case Code.USER_EXIST:
          console.log(Code);
            this._parent.createNotification('error', '错误', '用户已存在');
            localStorage.setItem('token', data.token);
            break;
        }
      }, error => this._parent.handleError(error), () => this._parent.handleSuccess());
    }
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private confirmServ: NzModalService,
    private _parent: ManageComponent
  ) {
  }

  ngOnInit(): void {
    console.log(this.users);
     this._parent.userService.list().subscribe(res => {
      const data = res.json();
      switch (data.code) {
        case Code.SUCCESS:
          this.users = data.users;
          break;
      }
    }, error => this._parent.handleError(error), () => this._parent.handleSuccess());

    this._parent.userService.list().subscribe(res => {
      const data = res.json();
      switch (data.code) {
        case Code.SUCCESS:
          this.users = data.users;
          break;
      }
    }, error => this._parent.handleError(error), () => this._parent.handleSuccess());

    this.validateForm = this.fb.group({
      username: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ],
      remember: [ true ]
    });
  }

  showDelete = (user: User) => {
    const username = user.username;
    const __this = this;
    this.confirmServ.confirm({
      nzTitle: `是否确认要删除用户:${username}`,
      nzOnOk() {
        __this._parent.userService.delete(username).subscribe(res => {
              const data: any = res.json();
              switch (data.code) {
                case Code.SUCCESS:
                  localStorage.setItem('token', data.token);
                  __this.users = [...__this.users.filter(v => v.username !== username)];
                  break;
                case Code.UNAUTHORIZED:
                  localStorage.removeItem('token');
                  break;
              }
            }, error => __this._parent.handleError(error), () => __this._parent.handleSuccess());
      },
      nzOnCancel() {
      }
    });
  }

  usersSortChange($event, key: string) {
    if ($event === 'ascend') {
      this.users = [...this.users.sort((a, b) => a[key] - b[key])];
    } else if ($event === 'descend') {
      this.users = [...this.users.sort((a, b) => b[key] - a[key])];
    }
  }
}
