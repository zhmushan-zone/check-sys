import { Observable } from 'rxjs/Rx';
import { UserService } from '../share/user.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzNotificationService } from "ng-zorro-antd";
import { Code } from "../share/model";

@Component({
  selector: 'manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  isCollapsed = false;

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private _notification: NzNotificationService,
    public userService: UserService
  ) { }

  ngOnInit() {

    let token = localStorage.getItem('token');

    if (token) {
      this.auth();

      Observable.interval(10 * 60 * 1000).subscribe(() => this.auth());
    } else {
      this.router.navigate(['login']);
    }
  }

  auth() {

    this.userService.auth().subscribe(res => {
      let data = res.json();
      // console.log(data)
      switch (data.code) {
        case Code.SUCCESS:
          if (data.user.role === 1) {
            localStorage.setItem('token', data.token);
            // this.username = data.user.username;
          } else {
            this.router.navigate(['calendar']);
          }
          break;
        case Code.UNAUTHORIZED:
          localStorage.removeItem('token');
          break;
      }
    }, error => this.handleError(error), () => this.handleSuccess())
  }

  createNotification = (type, title, msg) => {
    this._notification.create(type, title, msg);
  };

  handleError(error) {
    console.log(error);
    this.createNotification('error', '错误', '网络连接异常');
  }

  handleSuccess() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['login']);
    } else {
      this.ref.detectChanges();
    }

  }

}
