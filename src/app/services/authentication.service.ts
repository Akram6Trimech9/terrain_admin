import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  errorMessage: string | null = null;

  userStatus:BehaviorSubject<boolean>
  url: string = `${environment.apiUrl}/auth/`

  constructor(private router: Router, private cookieService: CookieService,  private http: HttpClient) {
    this.userStatus = new BehaviorSubject<boolean>(this.isAdminLogged) 
  }

  verificationLink(token: string):Observable<any>{ 
      return this.http.post<any>(`${this.url}email/confirm`,{token: token})
  }

  login(email: string, password: string): void {
    this.http.post<any>(`${this.url}local/signin`, { email, password } ).subscribe({
      next: response => {
        console.log(response)

          this.userStatus.next(true);
          this.router.navigate(['/administrator/dashboard']); 
      },
      error: error => {
        this.errorMessage = error.error?.message || 'Login failed. Please check your credentials and try again.';
        console.error('Login error:', error);
      },
      complete: () => {
        console.log('Login request completed');
      }
    });
  }

  logout() {
    this.cookieService.delete('authToken', '/'); 
    this.userStatus.next(false); 
    this.router.navigate(['/login']); 
  }

  get isAdminLogged(): boolean {
    if (typeof window !== 'undefined' && localStorage.getItem('access-token')) {
      return true;
    }
    return false;
  }
  
  
  getUserStatus(){
    this.userStatus.asObservable();
  }

  getUserData(){
    const token = this.cookieService.get('authToken');
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }
  resetPassword(password: string, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.patch(`${this.url}change-password`, { password }, { headers });
  }
  
}
