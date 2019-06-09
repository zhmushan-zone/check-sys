import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Code, User, UserRole } from '../share/model';
import { NzNotificationService } from 'ng-zorro-antd';
import { UserService } from '../share/user.service';
declare let particlesJS;

@Component({
  selector: 'app-login',
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
        const data = res.json();
        switch (data.code) {
          case Code.SUCCESS:
            localStorage.setItem('token', data.user.token);
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
            this._notification.error('error', '用户名或密码错误');
            break;
        }
      }, error => {
        this._notification.error('error', '网络连接异常');
        this._isSpinning = false;
        this.ref.detectChanges();
      }, () => {
        this._isSpinning = false;
        this.ref.detectChanges();
      });
    } else {
      // tslint:disable-next-line:forin
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  }

  ngOnInit() {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    this.validateForm = this.fb.group({
      username: [username, [Validators.required]],
      password: [password, [Validators.required]],
      remember: [true]
    });

    particlesJS.load('particles-js', '../../assets/particles.json', function () {
      console.log('callback - particles.js config loaded');
    });
  }

}
