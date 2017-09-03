import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzModalService, NzNotificationService } from "ng-zorro-antd";
import { UserService } from "../share/user.service";
import { Code } from "../share/model";

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  selectDate: Date = new Date();
  username: string;
  applyPrivateIsVisible = false;
  rankingIsVisible = false;
  isDisabled = true;
  baseInfo = {
    'privateTime': 0,
    'publicTime': 0,
    'lateTime': 0,
    'totalTime': 0,
    'role': -1,
    'calendar': {}
  }
  _date: Date = new Date();

  rank = [];

  constructor(
    private confirmServ: NzModalService,
    private userService: UserService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private _notification: NzNotificationService,
  ) { }

  ngOnInit() {
    // this.auth();

    let token = localStorage.getItem('token');
    // console.log(token)
    if (token) {
      this.userService.baseInfo().subscribe(res => {
        let data = res.json();
        switch (data.code) {
          case Code.SUCCESS:
            localStorage.setItem('token', data.token);
            this.username = data.user.username;
            this.baseInfo = data.user;
            break;
          case Code.UNAUTHORIZED:
            localStorage.removeItem('token');
            break;
        }
      }, error => this.handleError(error), () => this.handSuccess())

      this.userService.rank().subscribe(res => {
        let data = res.json();
        switch (data.code) {
          case Code.SUCCESS:
            this.rank = data.users;
            break;
        }
        // console.log(this.rank);
      }, error => this.handleError(error), () => this.handSuccess());

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
          localStorage.setItem('token', data.token);
          this.username = data.user.username;
          break;
        case Code.UNAUTHORIZED:
          localStorage.removeItem('token');
          break;
      }
    }, error => this.handleError(error), () => this.handSuccess())
  }

  check() {
    this.userService.check().subscribe(res => {
      let data = res.json();
      switch (data.code) {
        case Code.SUCCESS:
          this.baseInfo.calendar[data.calendar.key] = data.calendar.value;
          this.baseInfo.totalTime = data.user.totalTime;
          localStorage.setItem('token', data.token);
          this.createNotification('success', '成功', '签到成功');
          break;
        case Code.UNAUTHORIZED:
          localStorage.removeItem('token');
          break;
        case Code.OPERATION_WRONG:
          this.createNotification('error', '错误', '非法操作');
          break;
      }
    }, error => this.handleError(error), () => this.handSuccess());
  }

  showApplyModal = () => {
    this.applyPrivateIsVisible = true;
  }

  applyHandleOk = (e) => {
    this.applyPrivateIsVisible = false;
    this.userService.applyPrivate(this._date).subscribe(res => {
      let data = res.json();
      // console.log(data);
      switch (data.code) {
        case Code.SUCCESS:
          this.baseInfo.calendar[data.calendar.key] = data.calendar.value;
          this.baseInfo.lateTime = data.user.lateTime;
          this.baseInfo.privateTime = data.user.privateTime;
          this.baseInfo.totalTime = data.user.totalTime;
          localStorage.setItem('token', data.token);
          this.createNotification('success', '成功', '申请成功');
          break;
        case Code.UNAUTHORIZED:
          localStorage.removeItem('token');
          break;
        case Code.OPERATION_WRONG:
          this.createNotification('error', '错误', '非法操作');
          break;
      }
    }, error => this.handleError(error), () => this.handSuccess());
    // console.log(this._date)
  }

  applyHandleCancel = (e) => {
    // console.log(e);
    this.applyPrivateIsVisible = false;
  }

  showRanking = () => {
    this.rankingIsVisible = true;
  }

  rankingHandleOk = (e) => {
    this.rankingIsVisible = false;
  }

  rankingHandleCancel = (e) => {
    // console.log(e);
    this.rankingIsVisible = false;
  }

  createNotification = (type, title, msg) => {
    this._notification.create(type, title, msg);
  };

  handleError(error) {
    console.log(error);
    this.createNotification('error', '错误', '网络连接异常');
  }

  handSuccess() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['login']);
    }

    let date = new Date();
    let week = date.getDay();
    let hour = date.getHours();
    let minute = date.getMinutes();

    this.isDisabled = !(
      (week !== 6 && hour === 17 && minute >= 30)
      || (week === 6 && hour === 8 && 30 >= minute
      ));

    this.ref.detectChanges();
  }

}
