import { Component, OnInit } from '@angular/core';
import { WebRequestService } from '../web-request.service';
import {ThemePalette} from '@angular/material/core';


export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  
  task: Task = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'Primary', completed: false, color: 'primary'},
      {name: 'Accent', completed: false, color: 'accent'},
      {name: 'Warn', completed: false, color: 'warn'}
    ]
  };

  checked:boolean = false;
  enterNew:boolean = false;
  contactFirstName?:any;
  contactLastName?:any;
  newContacts:any;
  displayFirstName:boolean = true;
  displayLastName:boolean = true;
  displayState:boolean = true;

  constructor(
    private webReq: WebRequestService) { }

  ngOnInit(): void {
    this.webReq.get('contacts').subscribe((response: any) => {
      this.newContacts = response;
    });
  }

  log(name:string){
    
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
    // console.log
    // this.webReq.patch('chicken', {FirstName: "chicken"})
  }

  //   if (!lastName) {
  //     lastName = null;
  //   }
  //   this.newContacts.push({firstName: firstName, lastName: lastName})
  //   this.contactFirstName="";
  //   this.contactLastName="";
  //   console.log(firstName,lastName);
  
}
