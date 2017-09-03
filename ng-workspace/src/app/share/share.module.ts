import { UserService } from './user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from "ng-zorro-antd";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgZorroAntdModule.forRoot()
    ],
    exports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        NgZorroAntdModule
    ],
    providers: [
        UserService
    ]
})
export class ShareModule {}