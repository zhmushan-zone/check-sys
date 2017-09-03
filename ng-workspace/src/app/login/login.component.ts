import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Code, User, UserRole } from '../share/model';
import { NzNotificationService } from "ng-zorro-antd";
import { UserService } from "../share/user.service";
declare let particlesJS;

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  validateForm: FormGroup;
  user: User;
  _isSpinning = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private _notification: NzNotificationService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) { }
  login() {
    if (this.validateForm.valid) {
      this._isSpinning = true;
      this.user = this.validateForm.value;
      if (this.user.remember) {
        localStorage.setItem('username', this.user.username);
        localStorage.setItem('password', this.user.password);
      } else {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
      }
      this.userService.login(this.user).subscribe(res => {
        let data = res.json();
        switch (data.code) {
          case Code.SUCCESS:
            // this.cookieService.put('token', data.user.token);
            localStorage.setItem('token', data.user.token)
            switch (data.user.role) {
              case UserRole.USER:
                this.router.navigate(['calendar']);
                break;
              case UserRole.ADMIN:
                this.router.navigate(['manage']);
                break;
            }
            break;
          case Code.USERNAME_OR_PASSWARD_WRONG:
            this.createNotification('error', '用户名或密码错误');
            break;
        }
      }, error => {
        console.log(error);
        this.createNotification('error', '网络连接异常');
        this._isSpinning = false;
        this.ref.detectChanges();
      }, () => {
        this._isSpinning = false;
        this.ref.detectChanges();
      })
    } else {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
      }
    }
  }

  ngOnInit() {
    alert(`用户名：章宏彬    木杉，分别对应管理员和普通用户，密码123456`)
    let username = localStorage.getItem('username');
    let password = localStorage.getItem('password');
    this.validateForm = this.fb.group({
      username: [username, [Validators.required]],
      password: [password, [Validators.required]],
      remember: [true],
    });

    particlesJS.load('particles-js', '../../assets/particles.json', function () {
      console.log('callback - particles.js config loaded');
    });
  }

  createNotification = (type, msg) => {
    this._notification.create(type, '错误', msg);
  };

}
