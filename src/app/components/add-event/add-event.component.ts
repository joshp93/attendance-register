import { Component, OnInit, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidationService } from 'src/app/modules/custom-validation-service/custom-validation-service.module';
import { UserSession } from 'src/app/modules/user-session/user-session.module';
import { AngularFirestore, CollectionReference, DocumentReference } from "@angular/fire/firestore";
import { Key } from 'protractor';
import { relative } from 'path';
import { Route } from '@angular/compiler/src/core';
import { AttendanceService } from 'src/app/services/attendance-service.service';
import { ChurchEvent } from 'src/app/models/churchEvent.model';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  inputForm: FormGroup;
  required: string;
  submitText: string;
  buttonDisabled: boolean;
  loading: boolean;
  private datePattern: RegExp;
  private selectedFile = null;
  errors: Map<string, string>;
  eventId: string;

  constructor(private fb: FormBuilder, public auth: AngularFireAuth, private router: Router, private customValidation: CustomValidationService, private firestore: AngularFirestore, private route: ActivatedRoute, private attendaceService: AttendanceService) {
    this.initInputForm();
    this.eventId = "";
    if (this.router.getCurrentNavigation().extras.state) {
      this.eventId = this.router.getCurrentNavigation().extras.state["id"];
      this.attendaceService.getEvent(this.eventId).subscribe((val) => {
        this.inputForm.setValue({
          event: val.name,
          date: val.date.toDate()
        })
      });
    }
  }

  ngOnInit(): void {
  }

  initInputForm() {
    this.setLoadingState(false);
    this.datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    this.inputForm = this.fb.group({
      event: new FormControl("", Validators.required),
      date: new FormControl(new Date(), [Validators.required])
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
      this.attendaceService.setEvent(new ChurchEvent(this.eventId, this.inputForm.value.event, this.inputForm.value.date))
        .catch((reason) => console.log(reason))
        .finally(() => {
          this.setLoadingState(false);
          this.inputForm.reset();
          this.router.navigate(["home/events"]);
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
