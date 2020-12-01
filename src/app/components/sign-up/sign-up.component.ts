import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from "@angular/fire/auth";
import { UserSession } from 'src/app/modules/user-session/user-session.module';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, public auth: AngularFireAuth) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password1: new FormControl('', [Validators.required, Validators.minLength(6)]),
      password2: new FormControl('', [Validators.required, Validators.minLength(6)])
    }); //TODO Work out how to feedback validators to the end user
  }

  createUser() {
    if (this.signUpForm.value.password1 !== this.signUpForm.value.password2) {
      alert("passwords don't match"); //TODO Add proper validaion
      return;
    }
    if (this.signUpForm.valid) {
      this.auth.createUserWithEmailAndPassword(this.signUpForm.value.email, this.signUpForm.value.password1).then((user) => {
        let userSession = new UserSession();
        userSession.storeUserInfo(user.user.email);
      });
    }
  }

}
