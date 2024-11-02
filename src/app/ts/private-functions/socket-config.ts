import { Injectable } from "@angular/core";
import { Socket, SocketIoConfig } from "ngx-socket-io";
import { tokenGetter } from "./functions";
import { environment } from "../../../environments/environment";

    
  const config: SocketIoConfig = { url: environment.apiUrl, options: {
    extraHeaders:{
      Authorization:tokenGetter() || ''
    } 
  } };
 export class CustomSocket extends Socket{

constructor(){
    super(config)
}
}