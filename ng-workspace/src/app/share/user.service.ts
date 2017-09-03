import { Router } from '@angular/router';
import { User } from '../share/model';
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

    constructor(
        private http: Http,
        private router: Router
    ) { }

    // getPostTable(dataURL: string) {
    //     return this.http.get(dataURL)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable.throw(error || 'Server error'));
    // }

    login(user: User) {
        let data = new URLSearchParams();
        data.append('username', user.username);
        data.append('password', user.password);
        return this.http.post('http://localhost:3000/user/login', data);
    }

    auth() {
        return this.http.post('http://localhost:3000/user/auth', { 'token': localStorage.getItem('token') });
    }

    baseInfo() {
        return this.http.post('http://localhost:3000/user/base-info', { 'token': localStorage.getItem('token') });
    }

    check() {
        return this.http.post('http://localhost:3000/user/check', { 'token': localStorage.getItem('token') });
    }

    applyPrivate(date: Date) {
        return this.http.post('http://localhost:3000/user/apply-private', {
            'token': localStorage.getItem('token'),
            'date': date
        });
    }

    rank() {
        return this.http.get('http://localhost:3000/user/rank');
    }

    register(user: User) {
        let data = new URLSearchParams();
        data.append('username', user.username);
        data.append('password', user.password);
        data.append('token', localStorage.getItem('token'));
        return this.http.post('http://localhost:3000/user/register', data);
    }

    list() {
        return this.http.get('http://localhost:3000/user/list');
    }

    delete(username) {
        return this.http.post('http://localhost:3000/user/delete', {
            token: localStorage.getItem('token'),
            username: username
        });
    }

    checkInfo(date: Date) {
        return this.http.post('http://localhost:3000/user/check-info', {
            'date': date,
            'token': localStorage.getItem('token')
        });
    }

    changeStatus(checkStatus: number, username: string, date: Date) {
        return this.http.post('http://localhost:3000/user/change-status', {
            'checkStatus': checkStatus,
            'username': username,
            'date': date,
            'token': localStorage.getItem('token')
        })
    }
}