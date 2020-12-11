import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidationService } from 'src/app/modules/custom-validation-service/custom-validation-service.module';
import { UserSession } from 'src/app/modules/user-session/user-session.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  inputForm: FormGroup;
  buttonDisabled: boolean;
  loading: boolean;
  logInText: string;
  errors: Map<string, string>;
  
  constructor(private fb: FormBuilder, public auth: AngularFireAuth, private router: Router, private customValidation: CustomValidationService, private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.setLoadingState(false);
    this.inputForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
    this.initErrors();
  }

  initErrors() {
    this.errors = new Map<string, string>();
    this.errors.set("email", "");
    this.errors.set("password", "");
  }

  checkValid() {
    if (this.inputForm.invalid) {
      this.errors.forEach((value, key, mp) => {
        mp.set(key, this.inputForm.get(key).hasError("email") ? `${ this.inputForm.value.email } is not a valid email address` : "");
        if (mp.get(key) == "") {
          mp.set(key, this.inputForm.get(key).hasError("required") ? `${key} is required` : "");
        }
      })
    } else {
      this.errors.forEach((i) => {
        i = "";
      });
    }
  }

  close() {
    this.inputForm.reset();
    this.router.navigate(["../home"], { relativeTo: this.route });
  }

  logIn() {
    this.setLoadingState(true);
    if (this.inputForm.valid) {
      this.auth.signInWithEmailAndPassword(this.inputForm.value.email, this.inputForm.value.password).then((res) => {
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
