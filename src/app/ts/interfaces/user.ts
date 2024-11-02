 import { Role } from "../enum"

export interface UserInterface {
        id? :string ; 
        firstName?: string ; 
        lastName?: string ; 
        image?: string ; 
        email?: string ; 
        password?: string; 
        dateOfBirth?: Date; 
        phoneNumber:string; 
        country?: string; 
        address?: string; 
        role?: Role; 
        isEmailConfirmed?: boolean; 
        refreshToken?: string; 
 }