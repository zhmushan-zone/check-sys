import { RouterModule } from '@angular/router';
import { ShareModule } from '../../share/share.module';
import { ManageUserComponent } from './manage-user.component';
import { NgModule } from '@angular/core';
import { manageUserRoutes } from './manage-user.routes';

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(manageUserRoutes)
  ],
  declarations: [
    ManageUserComponent
  ]
})
export class ManageUserModule { }
