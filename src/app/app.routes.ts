import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { TokenVerificationComponent } from './views/tokenVerification/tokenVerification.component';

export const routes: Routes = [
    { path: 'adminlogin', component: LoginComponent },
    { 
        path: 'dashboard', 
        component: DashboardComponent, 
         
      },
      { path: '', redirectTo: '/adminlogin', pathMatch: 'full' },

      { path: 'verification/confirm', component: TokenVerificationComponent },

];
