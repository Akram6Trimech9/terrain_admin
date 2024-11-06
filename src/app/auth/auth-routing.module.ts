import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
  import { LoginComponent } from './login/login.component';
import { TokenVerificationComponent } from './tokenVerification/tokenVerification.component';
import { ResetPasswordComponent } from './resetPassword/resetPassword.component';
 
const routes: Routes = [
  {
    path:'',
    component:LoginComponent
  },
 
  { path: 'verification/confirm', component: TokenVerificationComponent },
  { path: 'verification/forgotPassword', component: ResetPasswordComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
