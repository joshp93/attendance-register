import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserSession } from 'src/app/modules/user-session/user-session.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  logInForm: FormGroup;
  required: string;

  constructor(private fb: FormBuilder, public auth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
    this.logInForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl('', Validators.required)
    });
  }

  logIn() {
    if (this.logInForm.valid) {
      this.auth.signInWithEmailAndPassword(this.logInForm.value.email, this.logInForm.value.password).then((res) => {
        let userSession = new UserSession();
        userSession.storeUserInfo(res.user);
        this.router.navigate(['/home']);
      })
      .catch((res) => {
        alert(res.message);
      });
    } else {
      alert("Please fill out all information")
    }
  }
}
