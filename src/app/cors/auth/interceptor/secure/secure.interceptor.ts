import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable()
export class SecureInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
     const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('access-token'))
    });
     return next.handle(authReq);
  }
}
export const SECURE_PROVIDER ={
    provide :  HTTP_INTERCEPTORS ,
    useClass : SecureInterceptor , 
     multi : true
    }
