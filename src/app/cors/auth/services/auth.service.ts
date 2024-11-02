import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
   import { AUTHORIZATION_HEADER_KEY, AUTHORIZATION_HEADER_PREFIX } from '../interceptor/token/token.interceptor';
import { AuthStoreService } from './auth-store.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import { ApiRoutes, LocalStorage } from '../../../ts/enum';
import { CredentialsInterface, LoginInterface, UserInterface } from '../../../ts/interfaces';
import { tokenInterface } from '../../../ts/interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient , private _authStore: AuthStoreService) { }

  helper = new JwtHelperService();
  
  IsUserExist(email: string): Observable<boolean> {
    return this._http.get(`${ApiRoutes.UserInfo}/${email}`).pipe(
    map((response: any ) => {
     const userExists = response && response.email === email ;
    return userExists;
    })
    );
    }

  confirm(token : any ) : Observable<CredentialsInterface>{
    return  this._http.post<CredentialsInterface>(ApiRoutes.confirmEmail, token)
  }
  

  login(payload : LoginInterface) : Observable<CredentialsInterface>{
    return  this._http.post<CredentialsInterface>(ApiRoutes.login, payload)
    .pipe(
      map( (credentials: CredentialsInterface) => { 
        this._authStore.login(credentials)
         return credentials ; 
      })
    )
  }

  register(payload: UserInterface): Observable<UserInterface> {
    return this._http.post<UserInterface>(ApiRoutes.register, payload).pipe(
      map((user: UserInterface) => {
        if (user.isEmailConfirmed) {
          console.log('User email  already confirmed');
        }
        return user;
      })
    );
  }
  
  logout() :Observable<void>{
    return    this._http.post(ApiRoutes.logout , {}).pipe(
       map(()=>{                
           this._authStore.logout()
       })
    )
  }

  getUserInfo(): Observable<UserInterface> {
    let token:any=localStorage.getItem(LocalStorage.AccessToken)
    let decodeToken=this.helper.decodeToken(token)
    const email = decodeToken.email
    return this._http.get<UserInterface>(`${ApiRoutes.UserInfo}/${email}`).pipe(
      map((user: UserInterface) => {
        this._authStore.setUserInfo(user);
        return user;
      })
    );
  }
  refreshToken(): Observable<tokenInterface> {    
    const headers = {
      [AUTHORIZATION_HEADER_KEY]: `${AUTHORIZATION_HEADER_PREFIX} ${this._authStore.gRefreshToken}`,
    };
    
    return this._http.get<tokenInterface>(ApiRoutes.refresh, { headers }).pipe(
      map(({ accessToken, refreshToken }: tokenInterface) => {
        this._authStore.setAccessToken(accessToken);
        this._authStore.setRefreshToken(refreshToken);
        return { accessToken, refreshToken };
      })
    );
  }
  get hasAccessToken(): boolean {
    return !!this._authStore.gAccessToken;
  }
  get getUser(){
    return  this.getUserInfo()
   } 


   sendResetPassword(email : any ){ 
    return   this._http.post(ApiRoutes.resetPasssend , email)
   } 
  
   changePasswordConfirm(obj: any): Observable<any> {
    const headers = {
      [AUTHORIZATION_HEADER_KEY]: `${AUTHORIZATION_HEADER_PREFIX} ${obj.token}`,
    };        
    let decodeToken = this.helper.decodeToken(obj.token);
    const email = decodeToken.email;
    const record = {
      email: email, 
      password: obj.password
    };
  
    return this._http.patch(ApiRoutes.updatePassword, record, { headers });
  }
  

}
