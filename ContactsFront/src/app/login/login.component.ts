import { WebRequestService } from './../web-request.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signUp:boolean = false;
  userTaken: number = -1;
  passwordInvalid:number = -1;
  constructor(private webReqService: WebRequestService) { }

  ngOnInit(): void {
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
