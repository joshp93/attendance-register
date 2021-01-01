import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Attendance } from 'src/app/models/Attendance.model';
import { ChurchEvent } from 'src/app/models/ChurchEvent.model';
import { AttendanceService } from 'src/app/services/attendance-service.service';

@Component({
  selector: 'app-register-attendance',
  templateUrl: './register-attendance.component.html',
  styleUrls: ['./register-attendance.component.scss'],
})
export class RegisterAttendanceComponent implements OnInit {
  inputForm: FormGroup;
  submitText: string;
  buttonDisabled: boolean;
  loading: boolean;
  events: ChurchEvent[];
  notARobot: boolean;
  errors: Map<string, string>;

  constructor(private fb: FormBuilder, public auth: AngularFireAuth, private router: Router, private firestore: AngularFirestore, private route: ActivatedRoute, private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.setLoadingState(false);
    this.inputForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      event: new FormControl('', [Validators.required]),
      date: new FormControl(moment(), [Validators.required])
    });
    this.initErrors();
    this.updateEvents();
  }

  initErrors() {
    this.errors = new Map<string, string>();
    this.errors.set("email", "");
    this.errors.set("event", "");
    this.errors.set("date", "");
  }

  checkValid() {
    if (this.inputForm.invalid) {
      this.errors.forEach((value, key, mp) => {
        mp.set(key, this.inputForm.get(key).hasError("matDatepickerParse") ? `${this.inputForm.get(key).errors.matDatepickerParse.text} is not a date` : "")
        if (mp.get(key) == "") {
          mp.set(key, this.inputForm.get(key).hasError("email") ? `${this.inputForm.value.email} is not a valid email` : "");
        }
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

  checkValidAndUpdateEvents() {
    this.checkValid();
    this.updateEvents();
  }

  updateEvents() {
    this.attendanceService.getEventsOnDate(moment(this.inputForm.value.date).toDate()).subscribe((observer) => {
      this.events = observer;
    });
  }

  close() {
    this.inputForm.reset();
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  submit() {
    this.setLoadingState(true);
    if (this.inputForm.valid && this.inputForm.touched && this.notARobot) {
      let attendance = new Attendance(this.inputForm.value.email, this.inputForm.value.event, moment(this.inputForm.value.date).toDate());
      this.attendanceService.setAttendance(attendance)
        .then(() => {
          alert(`You are registered for ${attendance.event}!\nشما ثبت نام کرده اید! ${attendance.event}`);
          this.router.navigate(["home"]);
        })
        .catch(() => {
          alert("There was a problem registering your attendance\nمشکلی در ثبت نام حضور شما وجود داشت");
        })
        .finally(() => {
          this.inputForm.reset();
          this.setLoadingState(false);
        });
    } else {
      this.setLoadingState(false);
    }
  }

  setLoadingState(isLoading: boolean) {
    isLoading ? this.buttonDisabled = true : this.buttonDisabled = false;
    isLoading ? this.submitText = "..." : this.submitText = "Submit - ارائه دادن";
    this.loading = isLoading;
  }

  onRecaptchaError(errorDetails: any[]) {
    console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }

  onRecaptchaResolved(captchaRespone) {
    this.notARobot = true;
  }
}