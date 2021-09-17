import { Component, OnInit, ViewChild } from '@angular/core';
import { WebRequestService } from '../web-request.service';
import { ThemePalette } from '@angular/material/core';
import { ElementRef } from '@angular/core';


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
  @ViewChild('myElement') myElement?: ElementRef;

  task: Task = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      { name: 'Primary', completed: false, color: 'primary' },
      { name: 'Accent', completed: false, color: 'accent' },
      { name: 'Warn', completed: false, color: 'warn' }
    ]
  };

  checked: boolean = false;
  checkStatus: boolean = false;
  editContact: boolean = false;
  enterNew: boolean = false;
  contactFirstName?: any;
  contactLastName?: any;
  newContacts: any;
  displayFirstName: boolean = true;
  displayLastName: boolean = true;
  displayState: boolean = true;

  ranVarFirst: any;
  ranVarLast: any;
  currentContactEdit: any;

  constructor(
    private webReq: WebRequestService) { }

  ngOnInit(): void {
    this.webReq.get('contacts').subscribe((response: any) => {
      this.newContacts = response;
    });
  }

  log(name: string) {

  }


  // getContacts() {
  //   this.contactsService.getContacts().subscribe((response: any)=> {
  //     console.log(response)
  //   })
  // }

  submitContact(firstName: string, lastName: string) {
    this.webReq.post('contacts', firstName, lastName).subscribe((response) => {
      console.log(response)
    })
  }


  updateContact(name: string, newFirstName: string, newLastName: string) {
     if (newFirstName === '' && newLastName === '') { // Both Empty
      newFirstName = this.ranVarFirst
      newLastName = this.ranVarLast
      this.editContact = false;
      console.log("first " + newFirstName + " last " +  newLastName)
    }
    else if (newFirstName !== '' && newLastName !== '') { // Both NOT Empty
      console.log(name + " is now " + "first " +  newFirstName + ' last ' + newLastName)
      this.editContact = false;
    }
    else if (newFirstName === '' && newLastName !== '') { // First Name Empty
      newFirstName = this.ranVarFirst;
      this.editContact = false;
      console.log(name + " is now " + newFirstName + ' ' + newLastName)
    }
    else if (newFirstName !== '' && newLastName === '') { // Last Name Empty
      newLastName = this.ranVarLast;
      console.log(name + " is now " + newFirstName + ' ' + newLastName)
      this.editContact=false; 
    }

    this.webReq.patch(name, newFirstName, newLastName)

  }

  updateCheckbox(name: any) {
    // this.updateContact(){

    // }
  }

  mouseenter(fN: any, lN: any) {
    this.ranVarFirst = fN;
    this.ranVarLast = lN;
    this.editContact = true
  }


  //   if (!lastName) {
  //     lastName = null;
  //   }
  //   this.newContacts.push({firstName: firstName, lastName: lastName})
  //   this.contactFirstName="";
  //   this.contactLastName="";
  //   console.log(firstName,lastName);

}
