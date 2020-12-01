import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from "@angular/fire/auth";

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
    });
  }

  createUser() {
    if (this.signUpForm.value.password1 !== this.signUpForm.value.password2) {
      alert("passwords don't match");
      return;
    }
    if (this.signUpForm.valid) {
      this.auth.createUserWithEmailAndPassword(this.signUpForm.value.email, this.signUpForm.value.password1).then(

      );
    }
  }

}
