import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  HttpClientModule } from '@angular/common/http';
 import { AuthService } from './services/auth.service';
import { TOKEN_PROVIDER } from './interceptor/token/token.interceptor';
import { BASE_URL_PROVIDER } from './interceptor/base-url.interceptor';
import { APP_INITIALIZER_PROVIDER } from './app.initializer';
import { REFRESH_TOKEN_PROVIDER } from './interceptor/token/refresh-token.interceptor';
import { AuthStoreService } from './services/auth-store.service';
import { LoginGuard } from '../_guards/auth-guard/login-guard.guard';
import { CurrentUserService } from './services/current-user.service';
import { SECURE_PROVIDER } from './interceptor/secure/secure.interceptor';
 
@NgModule({
  declarations: [],
  imports: [
    CommonModule ,
    HttpClientModule
  ],
  providers: [ BASE_URL_PROVIDER ,
    AuthService ,TOKEN_PROVIDER , 
    SECURE_PROVIDER,
      AuthStoreService,  APP_INITIALIZER_PROVIDER,
      LoginGuard,CurrentUserService ,
   REFRESH_TOKEN_PROVIDER ,APP_INITIALIZER_PROVIDER],})
export class AuthModule { }
