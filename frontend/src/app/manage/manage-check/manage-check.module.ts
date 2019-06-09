import { RouterModule } from '@angular/router';
import { ShareModule } from '../../share/share.module';
import { ManageCheckComponent } from './manage-check.component';
import { NgModule } from '@angular/core';
import { manageCheckRoutes } from './manage-check.routes';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(manageCheckRoutes),
    NgZorroAntdModule
  ],
  declarations: [
    ManageCheckComponent
  ]
})
export class ManageCheckModule { }
