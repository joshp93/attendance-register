import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  logInForm: FormGroup;

  constructor(private fb: FormBuilder, public auth: AngularFireAuth) { }

  ngOnInit(): void {
    this.logInForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  logIn() {
    if (this.logInForm.valid) {
      console.log(this.logInForm.value.email);
      this.storeCredentials(this.logInForm.value.email, this.logInForm.value.password);
      this.auth.signInWithEmailAndPassword(this.logInForm.value.email, this.logInForm.value.password).then(() => {
        console.log("Hey bro you're in");
      })
    } else {
      
    }
  }

  private storeCredentials(email: string, password: string) {
    // TODO: remember user's session
  }
}
