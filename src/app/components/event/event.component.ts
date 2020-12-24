import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidationService } from 'src/app/modules/custom-validation-service/custom-validation-service.module';
import { AttendanceService } from 'src/app/services/attendance-service.service';
import { ChurchEvent } from 'src/app/models/ChurchEvent.model';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  inputForm: FormGroup;
  required: string;
  submitText: string;
  buttonDisabled: boolean;
  deleteDisabled: boolean;
  loading: boolean;
  errors: Map<string, string>;
  eventId: string;
  recurranceTypes: string[] = ["Daily", "Weekly", "Monthly"];
  selRecurranceType: string;

  constructor(private fb: FormBuilder, private router: Router, private customValidation: CustomValidationService, private route: ActivatedRoute, private attendaceService: AttendanceService) {
    this.initInputForm();
    this.eventId = "";
    if (this.router.getCurrentNavigation().extras.state) {
      this.eventId = this.router.getCurrentNavigation().extras.state["id"];
      this.attendaceService.getEvent(this.eventId).subscribe((val) => {
        this.inputForm.setValue({
          event: val.name,
          date: val.date.toDate(),
          recurring: val.recurring,
          recurranceType: val.recurranceType
        });
        this.toggleRecurrance(val.recurring);
      });
    }
    this.deleteDisabled = this.eventId ? false : true;
  }

  ngOnInit(): void {
  }

  initInputForm() {
    this.setLoadingState(false);
    this.inputForm = this.fb.group({
      event: new FormControl("", Validators.required),
      date: new FormControl(new Date(), [Validators.required]),
      recurring: new FormControl(false),
      recurranceType: new FormControl(
        {
          value: "Weekly",
          disabled: true
        })
    });
    this.initErrors();
  }

  initErrors() {
    this.errors = new Map<string, string>();
    this.errors.set("event", "");
    this.errors.set("date", "");
    this.errors.set("recurring", "");
    this.errors.set("recurranceType", "");
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
      this.attendaceService.setEvent(new ChurchEvent(this.eventId, this.inputForm.value.event, this.inputForm.value.date, this.inputForm.value.recurring, this.inputForm.value.recurranceType))
        .catch((reason) => console.log(reason))
        .finally(() => {
          this.setLoadingState(false);
          this.inputForm.reset();
          this.router.navigate(["../"], { relativeTo: this.route });
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

  // onFileSelected(event) {
  //   this.selectedFile = event.target.files.file[0];
  // }
  getDeleteClasses() {
    return { notDelete : this.eventId === "" };
  }
  
  deleteEvent() {
    if (!confirm(`Are you sure you wish to delete this event?\nDoing so will not delete the associated Attendance records, they must be deleted separately`)) {
      return;
    }
    this.attendaceService.deleteEvent(this.eventId)
      .then(() => {
        this.inputForm.reset();
        this.router.navigate(["../"], { relativeTo: this.route });
      })
      .catch(() => {
        alert("There was a problem deleting the event.");
      });
  }

  toggleRecurrance(checked: boolean) {
    checked ? this.inputForm.get("recurranceType").enable() : this.inputForm.get("recurranceType").disable();
  }
}