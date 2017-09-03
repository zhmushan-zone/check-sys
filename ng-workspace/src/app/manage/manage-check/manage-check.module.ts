import { RouterModule } from '@angular/router';
import { ShareModule } from '../../share/share.module';
import { ManageCheckComponent } from './manage-check.component';
import { NgModule } from '@angular/core';
import { manageCheckRoutes } from "./manage-check.routes";

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(manageCheckRoutes)
  ],
  declarations: [
    ManageCheckComponent
  ]
})
export class ManageCheckModule { }
