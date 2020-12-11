import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CustomValidationService } from 'src/app/modules/custom-validation-service/custom-validation-service.module';

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
  events: any[];

  constructor(private fb: FormBuilder, public auth: AngularFireAuth, private router: Router, private customValidation: CustomValidationService, private firestore: AngularFirestore, private route: ActivatedRoute, private fs: AngularFirestore) {
    fs.collection("events").valueChanges().subscribe((val) => {
      this.events = new Array();
      val.forEach((e) => {
        this.events.push(e);
      });
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
      // this.firestore.collection("attendances").doc(this.inputForm.value.email)
      // .collection(this.inputForm.value.date).doc(this.inputForm.value.event).get()
      // .toPromise().then(() => {
      //   alert("You are already registered");
      //   this.setLoadingState(false);
      //   return;
      // });

      this.firestore.collection("attendances").doc(this.inputForm.value.email)
      .collection(this.inputForm.value.date).doc(this.inputForm.value.event).set({
        attended: ""
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

}
