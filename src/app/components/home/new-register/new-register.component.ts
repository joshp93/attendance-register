import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/modules/custom-validation-service/custom-validation-service.module';
import { UserSession } from 'src/app/modules/user-session/user-session.module';
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: 'app-new-register',
  templateUrl: './new-register.component.html',
  styleUrls: ['./new-register.component.scss']
})
export class NewRegisterComponent implements OnInit {
  registerForm: FormGroup;
  required: string;
  submitText: string;
  buttonDisabled: boolean;
  loading: boolean;

  constructor(private fb: FormBuilder, public auth: AngularFireAuth, private router: Router, private customValidation: CustomValidationService, private firestore: AngularFirestore) { }
  private datePattern: RegExp;
  private selectedFile = null;

  ngOnInit(): void {
    this.setLoadingState(false);
    this.datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    this.registerForm = this.fb.group({
      event: new FormControl('', [Validators.required]),
      date: new FormControl(new Date(), [Validators.pattern(this.datePattern)]),
      picture: new FormControl('')
    });
  }

  submit() {
    this.setLoadingState(true);
    // TODO work out authentication to firestore
    this.firestore.collection("register").doc(this.registerForm.value.event).set({
      date: this.registerForm.value.date,
      // picture: this.registerForm.value.picture
    })
    .then()
    .catch((res) => {
      alert(res);
    })
    .finally(() => {
      this.setLoadingState(false)
    });
    if (this.registerForm.valid) {
    } else {
      this.setLoadingState(false);
      alert("Please fill out all the information");
    }
  }

  setLoadingState(isLoading: boolean) {
    isLoading ? this.buttonDisabled = true : this.buttonDisabled = false;
    isLoading ? this.submitText = "..." : this.submitText = "Submit";
    this.loading = isLoading;
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files.file[0];
  }
}
