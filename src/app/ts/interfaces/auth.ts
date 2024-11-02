import { UserInterface } from "./user";

export interface tokenInterface {
accessToken  : string
refreshToken: string 
}

export interface CredentialsInterface extends tokenInterface {
    user : UserInterface
}

export interface LoginInterface { 
    email : string 
    password : string 
}