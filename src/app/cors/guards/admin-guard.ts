import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, type CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { AuthStoreService } from '../auth/services/auth-store.service';
 
export const AdminGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  if(inject(AuthStoreService).getAccessToken() ){
    return true ;
 }else{
    inject(Router).navigate(['/'])
    return false;

 }
};
