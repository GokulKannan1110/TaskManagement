import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { CreateTaskComponent } from "./create-task/create-task.component";
import { TaskDetailsComponent } from "./task-details/task-details.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared.module";
import { OverviewComponent } from './overview/overview.component';
import { RouterModule, Routes } from "@angular/router";
import { StatsComponent } from './stats/stats.component';
import { DashBoardRouteModule } from "./dashboard-route.module";



@NgModule({
    declarations: [
        DashboardComponent,
        CreateTaskComponent,
        TaskDetailsComponent,
        OverviewComponent,
        StatsComponent
    ],
    exports: [
        DashboardComponent,
        CreateTaskComponent,
        TaskDetailsComponent,
        SharedModule,
        DashBoardRouteModule
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule                
    ]
})

/*
Dont we need to import the dashboardRouteModule into the Dashboard module ? and export router module . But confusing here seeing dashboardRoute being exported and routerModule being imported

I think the reason for this is...
-> imports mean dependencies which we are going to use in this module. So we are importing RouterModule as we need to use router-outlet
-> exports mean what we want other modules to import, so we are exporting dashboardRouteModule since we want our root module to use it */
export class DashBoardModule{

}