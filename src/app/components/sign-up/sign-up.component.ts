import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from "@angular/fire/auth";
import { UserSession } from 'src/app/modules/user-session/user-session.module';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/modules/custom-validation-service/custom-validation-service.module';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, public auth: AngularFireAuth, private router: Router, private customValidation: CustomValidationService) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, this.customValidation.patternValidator()]),
      confirmPassword: new FormControl('', Validators.required)
    },
    {
      validators: this.customValidation.matchPassword('password', 'confirmPassword')
    }); 
  }

  createUser() {
    if (this.signUpForm.valid) {
      this.auth.createUserWithEmailAndPassword(this.signUpForm.value.email, this.signUpForm.value.password)
      .then((res) => {
        let userSession = new UserSession();
        this.auth.signInWithEmailAndPassword(res.user.email, this.signUpForm.value.password)
        .then((res) => {
          userSession.setStoredUserInfo(res.user);
          this.router.navigate(['/home']);
        });
      });
    } else {
      alert(this.signUpForm.errors)
    }
  }

}
