import { LoginComponent } from './login/login.component';
export const appRoutes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: 'calendar',
    loadChildren: './calendar/calendar.module#CalendarModule'
  },
  {
    path: 'manage',
    loadChildren: './manage/manage.module#ManageModule'
  }
];
