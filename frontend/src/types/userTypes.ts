export interface User {
    _id ?: string;
    name: string;
    email: string;
    password?: string
    token ?: string;
    phone?: string; 
    // meta?: any;   
    
    isVerified ?: boolean;
    isBlocked : boolean;
    role : string
  }
  
export interface UserData {
    name?: string;
    email: string;
    password?: string; 
  }

export interface UserCredentials extends User{
  phone?: string
  idType?: string
  idNumber ?: string
}