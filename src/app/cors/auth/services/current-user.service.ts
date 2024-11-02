import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
  import { AuthService } from "./auth.service";
import { UserInterface } from "../../../ts/interfaces";
import { LocalStorage, Role } from "../../../ts/enum";

@Injectable()
export class CurrentUserService {
    constructor(private _authService :AuthService){

    }
    currentUser$  = new BehaviorSubject<UserInterface |null | undefined>(undefined) ; 
    currentUserRole$  = new BehaviorSubject<Role |null | undefined>(undefined) ; 

    setCurrentUser(){
       if(localStorage.getItem(LocalStorage.AccessToken)){ 
        this._authService.getUserInfo().subscribe(res=>{
             this.currentUser$.next(res)             
            this.currentUserRole$.next(res.role)
        })
       }else{
        this.currentUser$.next(null)
       }
    }}
 