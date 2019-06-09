import { Router } from '@angular/router';
import { User } from '../share/model';
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  prefix = '/api/user';

    constructor(
        private http: Http,
        private router: Router
    ) { }

    login(user: User) {
        const data = new URLSearchParams();
        data.append('username', user.username);
        data.append('password', user.password);
        return this.http.post(`${this.prefix}/login`, data);
    }

    auth() {
        return this.http.post(`${this.prefix}/auth`, { 'token': localStorage.getItem('token') });
    }

    baseInfo() {
        return this.http.post(`${this.prefix}/base-info`, { 'token': localStorage.getItem('token') });
    }

    check() {
        return this.http.post(`${this.prefix}/check`, { 'token': localStorage.getItem('token') });
    }

    applyPrivate(date: Date) {
        return this.http.post(`${this.prefix}/apply-private`, {
            'token': localStorage.getItem('token'),
            'date': date
        });
    }

    rank() {
        return this.http.get(`${this.prefix}/rank`);
    }

    register(user: User) {
        const data = new URLSearchParams();
        data.append('username', user.username);
        data.append('password', user.password);
        data.append('token', localStorage.getItem('token'));
        return this.http.post(`${this.prefix}/register`, data);
    }

    list() {
        return this.http.get(`${this.prefix}/list`);
    }

    delete(username) {
        return this.http.post(`${this.prefix}/delete`, {
            token: localStorage.getItem('token'),
            username: username
        });
    }

    checkInfo(date: Date) {
        return this.http.post(`${this.prefix}/check-info`, {
            'date': date,
            'token': localStorage.getItem('token')
        });
    }

    changeStatus(checkStatus: number, username: string, date: Date) {
        return this.http.post(`${this.prefix}/change-status`, {
            'checkStatus': checkStatus,
            'username': username,
            'date': date,
            'token': localStorage.getItem('token')
        });
    }
}
