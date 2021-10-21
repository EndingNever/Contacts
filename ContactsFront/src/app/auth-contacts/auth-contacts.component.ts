import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { WebRequestService } from '../services/web-request.service';
import { GetContactsService } from '../services/get-contacts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginToken } from '../models/token.model';
import { Contact } from '../models/contacts.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-auth-contacts',
  templateUrl: './auth-contacts.component.html',
  styleUrls: ['./auth-contacts.component.css']
})
export class AuthContactsComponent implements OnInit {
  currentUser?:any;
  contacts:Contact[] = [];
  token: LoginToken = {accessToken: ''}
  newContact:boolean = false;
  editContact:any=-1;
  
  constructor( private webreq : WebRequestService,
    public router: Router, private route: ActivatedRoute, private contactService: GetContactsService) { }

  ngOnInit(): void {
      this.webreq.cast.subscribe(token => this.token = token)
      this.currentUser = this.webreq.currentUser
      this.contactService.cast.subscribe(contacts => this.contacts = contacts)
      if(this.token.accessToken ==='') {
        this.router.navigate(['/'], {relativeTo: this.route})
      }
  }

  addContacts(firstName: string, lastName: string) {
    if (firstName!=='' && lastName!=='') {
      this.contactService.addContact(firstName, lastName).subscribe((contact:any) => {
        this.contacts.push({id: -1, FirstName: firstName, LastName: lastName, userID: -1});
        // this.router.navigate(['../'], {relativeTo: this.route})
      })
      alert(`${firstName} ${lastName} added!`)
    }
    this.newContact=false;
  }

  enableEdit(index:number) {
    if (this.editContact === -1 ) {
      this.editContact=index;
    } else {
      this.editContact = -1
    }
  }

  onEditSubmit(oldFirst:string, oldLast:string, firstName:any, lastName:any) {
    let index = this.contacts.findIndex(contact => contact.FirstName === firstName);
    let contact: Contact = {"FirstName" : firstName, "LastName" : lastName, id: -1, userID: -1}
    this.contactService.editContact(oldFirst, oldLast, firstName, lastName).subscribe((res) => {
      // alert(`${oldFirst} ${oldLast} is now ${firstName} ${lastName}`)
      this.editContact=-1; 
    this.contacts.splice(index, 1, contact)
    })
  }
  
  deleteContact(firstName:string, lastName: string) {
    try {
      let index = this.contacts.findIndex(contact => contact.FirstName === firstName);

       this.contactService.deleteContact(firstName, lastName).subscribe((result) => {
        if(result.toString() === 'success') {
          this.contacts.splice(index, 1)
          alert(`${firstName} ${lastName} deleted!`)
        }
      })
    } catch (error:any) {
      console.log(error);
    }
  }
}
