import { WebRequestService } from './web-request.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetContactsService {


  
  contacts = [
    {
      firstName : "Harry",
      lastName : "Danger"
    },
    {
      firstName: "Darryl",
      lastName : "Hox"
    }
  ] 
  constructor (private webReqService: WebRequestService ) {  }

  getContacts() {
    return this.webReqService.get('contacts')
  }
  

  createContact(){
    // return this.webReqService.post('contacts');
  }
  
  
  
}
