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
  
   patch(uri: string, newFirstName:string, newLastName: string) {
    // console.log(`${this.ROOT_URL}/contacts/${uri}`, {"FirstName" : newFirstName, "LastName": newLastName})
    // this.http.patch(`${this.ROOT_URL}/'contacts'/${uri}`, {"FirstName" : newFirstName, "LastName": newLastName})
   }

   delete(uri:string) {
     return this.http.delete(`${this.ROOT_URL}/${uri}`)
   }
}
