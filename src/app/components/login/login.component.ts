import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/modules/custom-validation-service/custom-validation-service.module';
import { UserSession } from 'src/app/modules/user-session/user-session.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  logInForm: FormGroup;
  required: string;
  logInText: string;
  buttonDisabled: boolean;
  loading: boolean;
  
  constructor(private fb: FormBuilder, public auth: AngularFireAuth, private router: Router, private customValidation: CustomValidationService) { }
  
  ngOnInit(): void {
    this.setLoadingState(false);
    this.logInForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  logIn() {
    this.setLoadingState(true);
    if (this.logInForm.valid) {
      this.auth.signInWithEmailAndPassword(this.logInForm.value.email, this.logInForm.value.password).then((res) => {
        let userSession = new UserSession();
        userSession.setStoredUserInfo(res.user);
        this.setLoadingState(false);
        this.router.navigate(['/home']);
      })
      .catch((res) => {
        alert(res.message);
        this.setLoadingState(false);
      });
    } else {
      alert("Please fill out all information");
      this.setLoadingState(false);
    }
  }

  setLoadingState(isLoading: boolean) {
    isLoading ? this.buttonDisabled = true : this.buttonDisabled = false;
    isLoading ? this.logInText = "..." : this.logInText = "Login";
    this.loading = isLoading;
  }
}
