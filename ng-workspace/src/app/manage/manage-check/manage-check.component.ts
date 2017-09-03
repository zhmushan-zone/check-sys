import { CheckStatus, Code, User } from '../../share/model';
import { ManageComponent } from '../manage.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'manage-check',
  templateUrl: './manage-check.component.html',
  styleUrls: ['./manage-check.component.scss']
})
export class ManageCheckComponent implements OnInit {

  _date: Date = new Date();
  _disabledDate(current) {
    return current && current.getTime() > Date.now();
  }
  changeIsVisible = false;
  radioValue = 1;
  userIndex;
  users: User[] = [{}];

  constructor(
    private _parent: ManageComponent
  ) { }

  ngOnInit() {
    this.checkInfo(this._date);
  }

  selectTime() {
    this.checkInfo(this._date);
  }

  checkInfo(date: Date) {
    this._parent.userService.checkInfo(date).subscribe(res => {
      let data = res.json();
      // console.log(data);
      switch (data.code) {
        case Code.SUCCESS:
          this.users = data.users;
          // console.log(data.users)
          localStorage.setItem('token', data.token);
          break;
        case Code.UNAUTHORIZED:
          localStorage.removeItem('token');
          break;
      }
    }, error => this._parent.handleError(error), () => this._parent.handleSuccess());
  }

  changeModal = (index: number) => {
    let radioValue = this.users[index].checkStatus;
    this.radioValue
      = (radioValue === CheckStatus.PRIVATE
        || radioValue === CheckStatus.LATE
        || radioValue === CheckStatus.PUBLIC
        || radioValue === CheckStatus.ON_TIME) ? radioValue : CheckStatus.ON_TIME;
    this.userIndex = index;
    this.changeIsVisible = true;
  }

  handleChangeOk = (e) => {
    // console.log('点击了确定');
    if (this.users[this.userIndex].username &&
      (this.radioValue === CheckStatus.PRIVATE
        || this.radioValue === CheckStatus.LATE
        || this.radioValue === CheckStatus.PUBLIC
        || this.radioValue === CheckStatus.ON_TIME)) {
      this._parent.userService.changeStatus(this.radioValue, this.users[this.userIndex].username, this._date)
        .subscribe(res => {
          let data = res.json();
          console.log(data);
          switch (data.code) {
            case Code.SUCCESS:
              this.users[this.userIndex].checkStatus = data.user.checkStatus;
              this.users = this.users;
              localStorage.setItem('token', data.token);
              break;
            case Code.UNAUTHORIZED:
              localStorage.removeItem('token');
              break;
          }
        }, error => this._parent.handleError(error), () => this._parent.handleSuccess());
    } else {
      this._parent.createNotification('error', '错误', '非法操作');
    }
    this.changeIsVisible = false;
  }

  handleChangeCancel = (e) => {
    // console.log(e);
    this.changeIsVisible = false;
  }

}
