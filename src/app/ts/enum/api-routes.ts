export enum ApiRoutes {
    login = '/auth/local/signin',
    logout = '/auth/logout' , 
    refresh= '/auth/refresh',
    UserInfo = '/users/email',
    Users = '/users',
    register='/auth/register',
    confirmEmail='/email-confirmation/confirm',
    resetPasssend='/reset/send',
    updatePassword='/reset/changepassword',
  }