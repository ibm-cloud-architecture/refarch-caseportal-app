export class User {
  email: string;
  firstname: string;
  lastname: string;
  password : string;
  token : string;
  constructor(email,fn,pwd){
    this.email = email;
    this.firstname = fn;
    this.password = pwd;
  }
}

export interface LoginRequest {
  userName: string;
  password: string;
}
