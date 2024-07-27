import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router'; 
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [ 
    { path: '', component: HomeComponent },
    { path: 'login', loadChildren: () => import('./login/auth.module').then( (mod) => mod.AuthModule)},
    { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then((mod) => mod.DashBoardModule)}       
  ]; 

  //In older versions, the lazy loaded module is defined in the below way.
  //{ path: 'dashboard', loadChildren: "./dashboard/dashboard.module#DashBoardModule"

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})], 
  exports: [RouterModule], 
  providers: []
})
export class RouteModule { }
