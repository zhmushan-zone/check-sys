import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { loginRoutes } from './login.routes';
import { ShareModule } from '../share/share.module';
import { UserService } from '../share/user.service';
@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        ShareModule,
        RouterModule.forChild(loginRoutes),
    ],
    providers: [
        UserService
    ],
    bootstrap: []
})

export class LoginModule {}
