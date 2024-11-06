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
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url: string = `${environment.apiUrl}`

  constructor(private _http: HttpClient , private _authStore: AuthStoreService , private router : Router) { }

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
    return  this._http.post<CredentialsInterface>(`${this.url}/auth/local/signin`, payload)
    .pipe(
      map( (credentials: CredentialsInterface) => { 
        console.log()
        this._authStore.login(credentials)
        this.getUserInfo()
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
  
  logout()  {
    this._authStore.logout()
this.router.navigateByUrl('/')
  }

  getUserInfo(): Observable<UserInterface> {
    const token: any = localStorage.getItem(LocalStorage.AccessToken);

    if (!token) {
      console.error('No token found!');
      // Handle missing token (e.g., redirect to login)
      return new Observable();
    }

    // Decode the token and check if it is expired
    const decodeToken = this.helper.decodeToken(token);

    if (!decodeToken || this.helper.isTokenExpired(token)) {
      console.error('Token is invalid or expired!');
      // Handle invalid or expired token (e.g., redirect to login)
      return new Observable();
    }

    const email = decodeToken.email;

    return this._http.get<UserInterface>(`${this.url}/user/email/${email}`).pipe(
      map((user: UserInterface) => {
        this._authStore.setUserInfo(user); // Store the user info in the auth store
        return user;
      })
    );
  }
  refreshToken(): Observable<tokenInterface> {    
    const headers = {
      [AUTHORIZATION_HEADER_KEY]: `${AUTHORIZATION_HEADER_PREFIX} ${this._authStore.gRefreshToken}`,
    };
    
    return this._http.get<tokenInterface>(ApiRoutes.refresh, { headers }).pipe(
      map(({ refresh_token, access_token }: tokenInterface) => {
        this._authStore.setAccessToken(access_token);
        this._authStore.setRefreshToken(refresh_token);
        return { access_token, refresh_token };
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
