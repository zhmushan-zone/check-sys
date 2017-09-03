import { ManageCheckComponent } from './manage-check/manage-check.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageComponent } from "./manage.component";

export const manageRoutes = [
    {
        path: '',
        component: ManageComponent,
        children: [
            {
                path: '',
                redirectTo: 'user',
                pathMatch: 'full'
            },
            {
                path: 'user',
                // component: ManageUserComponent
                loadChildren: './manage-user/manage-user.module#ManageUserModule'
            },
            {
                path: 'check',
                // component: ManageCheckComponent
                loadChildren: './manage-check/manage-check.module#ManageCheckModule'
            }
        ]
    }
];