import { WebRequestService } from '../services/web-request.service';
import { Component, OnInit } from '@angular/core';
import { LoginToken } from '../models/token.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GetContactsService } from '../services/get-contacts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signUp:boolean = false;

  user:any;
  contacts:any;
  userTaken: number = -1;

  token: LoginToken = {accessToken: ''}

  userNotFound: number = -1;

  passwordInvalid:number = -1;

  constructor(
    private getContacts: GetContactsService,
    private route: ActivatedRoute,
    public router: Router,
    private webReqService: WebRequestService) { }

  ngOnInit(): void {
  }
  
  onLogin(userName:string, userPassword:string) {
    this.passwordInvalid = -1;
    this.userNotFound = -1;

    try{
      if(userName.length !== 0 && userPassword.length !==0) {
        this.webReqService.login(userName, userPassword).subscribe((token) => {
          if(token.accessToken === 'passwordInvalid') {
            this.passwordInvalid = 1;
          } else if (token.accessToken === 'usernameNotFound') {
            this.passwordInvalid = 1;
          } else {
            
            this.webReqService.setLoginToken('Bearer ' + token.accessToken)
            this.getContacts.getContacts().subscribe((contacts:any) => {
              this.getContacts.setContacts(this.contacts = contacts);
            })
            this.router.navigate(['/contacts'], {relativeTo: this.route})
          }
        })
      }
    }catch(error) {
      console.log(error);
    }
  }
  
  onCreateUser(userName: string, userPassword: string) {
    if (!userName || !userPassword) {
      alert("username and password required")
    } else if (userPassword.length < 3 || userName.length < 3) {
      alert('username and password must be at least 3 characters')
    } else {
      this.webReqService.signUp("signup", userName, userPassword).subscribe((result: any) => {
        if (result === 'Username is unavailable.') {
          this.userTaken = 1;
        } else if (result === 'User added.') {
          alert("Account Created. You may now Login.")
          this.signUp = false;
        }
      })
    }

  } 
}
