import { ManageComponent } from './manage.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ShareModule } from '../share/share.module';
import { manageRoutes } from './manage.routes';

@NgModule({
    declarations: [
        ManageComponent
    ],
    imports: [
        ShareModule,
        RouterModule.forChild(manageRoutes)
    ],
    providers: [
    ],
    bootstrap: [],
})

export class ManageModule {}
