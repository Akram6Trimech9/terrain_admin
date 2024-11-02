import { LocalStorage } from "../enum";

export function tokenGetter(){
    return localStorage.getItem(LocalStorage.AccessToken)
}