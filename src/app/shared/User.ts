export class User {
  email: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  token?: string;
  constructor(email?: string,fn?: string,pwd?: string){
    this.email = email;
    this.firstname = fn;
    this.password = pwd;
  }
}

export interface LoginRequest {
  email: string;
  password: string;
}
