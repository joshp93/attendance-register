import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/modules/custom-validation-service/custom-validation-service.module';
import { UserSession } from 'src/app/modules/user-session/user-session.module';
import { AngularFirestore, CollectionReference, DocumentReference } from "@angular/fire/firestore";

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
  eventHasError: boolean;
  eventError: string;
  dateHasError: boolean;
  dateError: string;

  constructor(private fb: FormBuilder, public auth: AngularFireAuth, private router: Router, private customValidation: CustomValidationService, private firestore: AngularFirestore) { }
  private datePattern: RegExp;
  private selectedFile = null;

  ngOnInit(): void {
    this.setLoadingState(false);
    this.datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    this.registerForm = this.fb.group({
      event: new FormControl('', Validators.required),
      date: new FormControl(new Date(), [Validators.required]), //Validators.pattern(this.datePattern)]),
      picture: new FormControl('')
    });
  }

  checkValid(event) {
    switch(event.target.name) {
      case "date": {
        this.checkDateValid(event);
        break;
      } case "event": {
        this.checkEventValid(event);
        break;
      }
    }
  }

  checkEventValid(event) {
    if (this.registerForm.get(event.target.name).errors) {
      this.eventHasError = this.registerForm.get(event.target.name).errors.required;
      this.eventHasError ? this.eventError = "Please enter an event name" : this.eventError = "";
    } else {
      this.eventHasError = false;
    }
  }
  checkDateValid(event) {
    if (this.registerForm.get("date").errors) {
      console.log(this.registerForm.get(event.target.name).errors);
      if(this.registerForm.get(event.target.name).errors.matDatepickerParse) {
        this.dateHasError = true;
        this.dateError = `"${ this.registerForm.get(event.target.name).errors.matDatepickerParse.text }" is not a valid date`;
      } else if(this.registerForm.get(event.target.name).errors.required) {
        console.log(this.registerForm.get(event.target.name).errors.required);
        this.dateHasError = true;
        this.dateError = "Please enter a date";
      } else {
        this.dateHasError = false;
        this.dateError = "";
      }
    } else {
      this.dateHasError = false;
      this.dateError = "";
    }
  }
  cancel() {
    this.registerForm.reset();
    this.router.navigate(["home"]);
  }

  submit() {
    this.setLoadingState(true);
    if (this.registerForm.valid) {
      this.firestore.collection("registers").doc(this.firestore.createId()).set({
        event: this.registerForm.value.event,
        date: this.registerForm.value.date
        // picture: this.registerForm.value.picture
      })
      .then()
      .catch((res) => {
        alert(res);
      })
      .finally(() => {
        this.setLoadingState(false);
        this.registerForm.reset();
      });
    } else {
      this.setLoadingState(false);
      this.registerForm.errors.forEach(element => {
        console.log(element);
      });
      alert(this.registerForm.errors);
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
