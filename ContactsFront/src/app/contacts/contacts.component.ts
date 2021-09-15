import { GetContactsService } from './../get-contacts.service';
import { Component, OnInit } from '@angular/core';
import { WebRequestService } from '../web-request.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  contactFirstName?:any;
  contactLastName?:any;
  newContacts:any;

  constructor(private webReq: WebRequestService) { }

  ngOnInit(): void {
    this.webReq.get('contacts').subscribe((response: any) => {
      this.newContacts = response;
    });
  }

  // getContacts() {
  //   this.contactsService.getContacts().subscribe((response: any)=> {
  //     console.log(response)
  //   })
  // }
  
  submitContact(firstName:string, lastName: string) {
      this.webReq.post('contacts', firstName, lastName).subscribe((response) => {
        console.log(response)
      })
    }

  updateContact() {
    // this.webReq.patch('contacts', )
    this.webReq.patch('chicken', {FirstName: "chicken"})
  }

  //   if (!lastName) {
  //     lastName = null;
  //   }
  //   this.newContacts.push({firstName: firstName, lastName: lastName})
  //   this.contactFirstName="";
  //   this.contactLastName="";
  //   console.log(firstName,lastName);
  
}
