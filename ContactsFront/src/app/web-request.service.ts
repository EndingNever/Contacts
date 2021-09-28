import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly ROOT_URL;
  
  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:3000';
   }

   get(uri:string) {
    return this.http.get(`${this.ROOT_URL}/${uri}`)
   }

   post(uri: string, firstName:any, lastName: any) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, {"FirstName" : firstName, "LastName": lastName})
   }
  
   signUp(uri:any, userName:string, userPass:string) {
     try {
       return this.http.post(`${this.ROOT_URL}/${uri}`,{"userName": userName, "userPassword": userPass} )
     } catch(error:any) {
       return error
     }
   }
   
   patch(uri: string, newFirstName:string, newLastName: string) {
    return this.http.patch(`${this.ROOT_URL}/contacts/${uri}`, {"FirstName" : newFirstName, "LastName": newLastName})
    }

   delete(uri:string) {
     return this.http.delete(`${this.ROOT_URL}/${uri}`)
   }
}
