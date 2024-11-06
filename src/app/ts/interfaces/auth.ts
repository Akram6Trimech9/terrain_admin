import { UserInterface } from "./user";

export interface tokenInterface {
    access_token  : string
    refresh_token: string 
}

export interface CredentialsInterface extends tokenInterface {
    user : UserInterface
}

export interface LoginInterface { 
    email : string 
    password : string 
}