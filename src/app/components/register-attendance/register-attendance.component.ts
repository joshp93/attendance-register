import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Attendance } from 'src/app/models/Attendance.model';
import { ChurchEvent } from 'src/app/models/ChurchEvent.model';
import { CustomValidationService } from 'src/app/modules/custom-validation-service/custom-validation-service.module';
import { AttendanceService } from 'src/app/services/attendance-service.service';

@Component({
  selector: 'app-register-attendance',
  templateUrl: './register-attendance.component.html',
  styleUrls: ['./register-attendance.component.scss']
})
export class RegisterAttendanceComponent implements OnInit {
  inputForm: FormGroup;
  submitText: string;
  buttonDisabled: boolean;
  loading: boolean;
  events: ChurchEvent[];

  constructor(private fb: FormBuilder, public auth: AngularFireAuth, private router: Router, private customValidation: CustomValidationService, private firestore: AngularFirestore, private route: ActivatedRoute, private attendanceService: AttendanceService) {
    this.attendanceService.getEvents().subscribe((observer) => {
      this.events = observer;
    });
  }

  private datePattern: RegExp;
  errors: Map<string, string>;

  ngOnInit(): void {
    this.setLoadingState(false);
    this.datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    this.inputForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      event: new FormControl('', [Validators.required]),
      date: new FormControl(new Date(), [Validators.required])
    });
    this.initErrors();
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

  close() {
    this.inputForm.reset();
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  submit() {
    this.setLoadingState(true);
    if (this.inputForm.valid && this.inputForm.touched) {
      let attendance = new Attendance(this.inputForm.value.email, this.inputForm.value.event, this.inputForm.value.date);
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

}
