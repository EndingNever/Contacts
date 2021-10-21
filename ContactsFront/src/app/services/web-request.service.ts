import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginToken } from '../models/token.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  url: string = "http://localhost:3000";
  private loginToken = new BehaviorSubject<LoginToken>({accessToken: ''});
  cast = this.loginToken.asObservable();
  readonly ROOT_URL;
  user: any;
  currentUser?:string
  
  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:3000';
   }

   get(uri:string) {
    return this.http.get(`${this.ROOT_URL}/${uri}`)
   }

   post(firstName:any, lastName: any) {
     console.log(`${this.ROOT_URL}/contacts`, {"FirstName" : firstName, "LastName": lastName})
    return this.http.post(`${this.ROOT_URL}/contacts`, {"FirstName" : firstName, "LastName": lastName})
   }
  
   login(userName: string, userPassword:string): Observable<LoginToken> {
    try {
      
      this.currentUser = userName;
      return this.http.post<LoginToken>(`${this.ROOT_URL}/login`, {"userName": userName, "userPassword": userPassword})
    } catch (error:any){
        return error;
    }
   }
  
   signUp(uri:any, userName:string, userPass:string) {
     try {
       return this.http.post(`${this.ROOT_URL}/${uri}`,{"userName": userName, "userPassword": userPass} )
     } catch(error:any) {
       return error
     }
   }


   setLoginToken(token:string) {
     this.loginToken.next({accessToken: token})
   }
   
   patch(uri: string, newFirstName:string, newLastName: string) {
    return this.http.patch(`${this.ROOT_URL}/contacts/${uri}`, {"FirstName" : newFirstName, "LastName": newLastName})
    }

   delete(uri:string) {
     return this.http.delete(`${this.ROOT_URL}/${uri}`)
   }
}
