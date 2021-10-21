import { WebRequestService } from './web-request.service';
import { Injectable } from '@angular/core';
import { LoginToken } from '../models/token.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment'; //TODO delete on production
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '../models/contacts.model';


@Injectable({
  providedIn: 'root'
})
export class GetContactsService {

  private contacts = new BehaviorSubject<Contact[]>([]);
  token: LoginToken = { accessToken: '' };
  url: string = "http://localhost:3000";
  cast = this.contacts.asObservable();
  user: any;

  constructor(private webReqService: WebRequestService, private http: HttpClient) { }

  getContacts() {
    try {

      this.webReqService.cast.subscribe(token => this.token = token);
      const httpOptions = {
        headers: new HttpHeaders({
          'authorization': this.token.accessToken
        })
      };

      return this.http.get<Contact[]>(this.url + '/contacts', httpOptions)
    } catch (error: any) {
      console.log('getContacts service error ' + error);
      return error
    }
  }

  setContacts(contacts: Contact[]) {
    this.contacts.next(contacts)
  }

  editContact(oldFirst:string, oldLast:string, newFirst:string, newLast:string) {
    const updatedContact = {"FirstName" : newFirst, "LastName" : newLast}
        const httpOptions = {
        headers: new HttpHeaders({
          'authorization': this.token.accessToken})};
      return this.http.put(`${this.url}/contacts/${oldFirst}/${oldLast}`, updatedContact, httpOptions)

  }

  addContact(firstName: string, lastName: string) {
    const contact = { "FirstName": firstName, "LastName": lastName }
    try {
      const httpOptions = {
        headers: new HttpHeaders({
          'authorization': this.token.accessToken
        })
      };

      return this.http.post(this.url + '/contacts', contact, httpOptions)
    } catch (error: any) {
      return error
    }
  }

  deleteContact(firstName: string, lastName: string) {
    const contact = { "FirstName": firstName, "LastName": lastName }
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': this.token.accessToken
      })
    };
    return this.http.delete(this.url + '/contacts/' + contact.FirstName + '/' + contact.LastName, httpOptions)

  }

}
