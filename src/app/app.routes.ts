import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminGuard } from './cors/guards/admin-guard';
 

export const routes: Routes = [
  {
    path:'',
    component:AuthLayoutComponent,
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
 },
  {
    path:'administrator',
    component:AdminLayoutComponent,
    canActivate:[AdminGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
 },


];