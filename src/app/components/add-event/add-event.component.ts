import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidationService } from 'src/app/modules/custom-validation-service/custom-validation-service.module';
import { UserSession } from 'src/app/modules/user-session/user-session.module';
import { AngularFirestore, CollectionReference, DocumentReference } from "@angular/fire/firestore";
import { Key } from 'protractor';
import { relative } from 'path';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-new-register',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  inputForm: FormGroup;
  required: string;
  submitText: string;
  buttonDisabled: boolean;
  loading: boolean;
  eventHasError: boolean;
  eventError: string;
  dateHasError: boolean;
  dateError: string;

  constructor(private fb: FormBuilder, public auth: AngularFireAuth, private router: Router, private customValidation: CustomValidationService, private firestore: AngularFirestore, private route: ActivatedRoute) { }
  private datePattern: RegExp;
  private selectedFile = null;
  errors: Map<string, string>;

  ngOnInit(): void {
    this.setLoadingState(false);
    this.datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    this.inputForm = this.fb.group({
      event: new FormControl('', Validators.required),
      date: new FormControl(new Date(), [Validators.required]), //Validators.pattern(this.datePattern)]),
      picture: new FormControl('')
    });
    this.initErrors();
  }

  initErrors() {
    this.errors = new Map<string, string>();
    this.errors.set("event", "");
    this.errors.set("date", "");
  }

  checkValid() {
    if (this.inputForm.invalid) {
      this.errors.forEach((value, key, mp) => {
        mp.set(key, this.inputForm.get(key).hasError("matDatepickerParse") ? `${this.inputForm.get(key).errors.matDatepickerParse.text} is not a date` : "")
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
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  submit() {
    this.setLoadingState(true);
    if (this.inputForm.valid && this.inputForm.touched) {
      this.firestore.collection("events").doc(this.firestore.createId()).set({
        event: this.inputForm.value.event,
        date: this.inputForm.value.date
      })
        .then()
        .catch((res) => {
          alert(res);
        })
        .finally(() => {
          this.setLoadingState(false);
          this.inputForm.reset();
        });
    } else {
      this.setLoadingState(false);
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
