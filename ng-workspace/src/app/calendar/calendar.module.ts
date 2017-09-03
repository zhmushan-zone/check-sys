import { CalendarComponent } from './calendar.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ShareModule } from "../share/share.module";
import { calendarRoutes } from "./calendar.routes";
@NgModule({
    declarations: [
        CalendarComponent
    ],
    imports: [
        ShareModule,
        RouterModule.forChild(calendarRoutes)
    ],
    providers: [
    ],
    bootstrap: []
})

export class CalendarModule {}