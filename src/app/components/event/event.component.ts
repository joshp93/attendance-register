import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceService } from 'src/app/services/attendance-service.service';
import { ChurchEvent } from 'src/app/models/ChurchEvent.model';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { YesNoDialogComponent } from '../yes-no-dialog/yes-no-dialog.component';
import { DialogHelperService } from 'src/app/services/dialog-helper.service';
import * as _moment from 'moment';


const moment = _moment;

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
  docId: string;
  recurranceTypes: string[] = ["Daily", "Weekly", "Monthly"];
  selRecurranceType: string;
  event: ChurchEvent;
  recurranceChanged: boolean;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, 
    private attendaceService: AttendanceService, private yesNoDialog: MatDialog, private dialogRef: MatDialogRef<YesNoDialogComponent>) {

    this.initInputForm();
    this.docId = "";
    if (this.router.getCurrentNavigation().extras.state) {
      this.docId = this.router.getCurrentNavigation().extras.state["docId"];
      this.attendaceService.getEvent(this.docId).subscribe((val) => {
        this.event = val;
        this.inputForm.setValue({
          event: val.name,
          date: moment(val.date.toDate()),
          recurring: val.recurring,
          recurranceType: val.recurranceType
        });
        this.toggleRecurrance(val.recurring);
      });
    }
    this.deleteDisabled = this.docId ? false : true;
  }

  ngOnInit(): void {
  }

  initInputForm() {
    this.setLoadingState(false);
    this.inputForm = this.fb.group({
      event: new FormControl("", Validators.required),
      date: new FormControl(moment(), [Validators.required]),
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
    if (this.inputForm.valid && this.inputForm.touched) {
      if (this.event) {
        if ((this.event.recurring != this.inputForm.value.recurring)
          || (this.event.recurranceType != this.inputForm.value.recurranceType)
          || (this.event.date != this.inputForm.value.date)) {
          this.recurranceChanged = true;
        } else {
          this.recurranceChanged = false;
        }
      }

      this.setLoadingState(true);
      if (this.event) {
        this.updateEvent();
      } else {
        this.createEvent();
      }
    } else {
      this.setLoadingState(false);
    }
  }

  private createEvent() {
    this.attendaceService.setEvent(new ChurchEvent(this.docId, this.docId, this.inputForm.value.event, moment(this.inputForm.value.date).toDate(), this.inputForm.value.recurring, this.inputForm.value.recurranceType))
      .catch(() => alert("there was an issue creating the event."))
      .finally(() => {
        this.setLoadingState(false);
        this.inputForm.reset();
        this.router.navigate(["../"], { relativeTo: this.route });
      });
  }

  private queryUserSet(dialogHelper: DialogHelperService) {
    if (this.recurranceChanged) {
      if (this.event.recurring && !this.inputForm.value.recurring) {
        this.dialogRef = this.yesNoDialog.open(YesNoDialogComponent, dialogHelper.setYesNoConfig("you are changing the event recurrance... Do you want to continue?",
          `Making this event non-recurring will de-link it from the other events in this series. It will become a one-off event with the same name.`,
          "Yes",
          "",
          "No"
        ));
      } else {
        this.dialogRef = this.yesNoDialog.open(YesNoDialogComponent, dialogHelper.setYesNoConfig("you are changing the event recurrance... Do you want to continue?",
          `Changing the recurrance details for this event will create a new event series with the specified info.`,
          "Yes",
          "",
          "No"
        ));
      }
    } else {
      if (this.event.recurring && this.inputForm.value.recurring) {
        this.dialogRef = this.yesNoDialog.open(YesNoDialogComponent, dialogHelper.setYesNoConfig("This is a recurring event... What do you want to do?",
          `Updating the event(s) will not update the associated Attendance records.
          Updating this event alone will de-link it from the other events in this series. It will become a one-off event with the same name.
          What do you want to do?`,
          "Update all events",
          "Update this event",
          "Cancel"
        ));
      } else {
        this.dialogRef = this.yesNoDialog.open(YesNoDialogComponent, dialogHelper.setYesNoConfig("Are you sure you wish to update this event?",
          "Doing so will not update the associated Attendance records.",
          "Yes",
          "",
          "No"
        ));
      }
    }
  }

  private updateEvent() {
    let dialogHelper = new DialogHelperService();
    this.queryUserSet(dialogHelper);

    this.dialogRef.afterClosed().subscribe((result) => {
      switch (result) {
        case "Update all events":
          this.updateRecurringEvent();
          break;
        case "Update this event":
          this.inputForm.get("recurring").setValue(false);
        case "Yes":
          this.createEvent();
          break;
        default:
          this.setLoadingState(false);
          break;
      }
    });
  }

  private updateRecurringEvent() {
    this.attendaceService.setRecurringEvent(new ChurchEvent(this.docId, this.event.eventId, this.inputForm.value.event, moment(this.inputForm.value.date).toDate(), this.inputForm.value.recurring, this.inputForm.value.recurranceType))
      .catch((reason) => console.log(reason))
      .finally(() => {
        this.setLoadingState(false);
        this.inputForm.reset();
        this.router.navigate(["../"], { relativeTo: this.route });
      });
  }

  setLoadingState(isLoading: boolean) {
    if (isLoading) {
      this.buttonDisabled = true;
      this.submitText = "...";
      this.deleteDisabled = true;
    } else {
      this.buttonDisabled = false;
      this.submitText = "Submit";
      this.deleteDisabled = this.docId ? false : true;
    }
    this.loading = isLoading;
  }

  queryUserDelete(dialogHelper: DialogHelperService) {
    if (this.event.recurring) {
      this.dialogRef = this.yesNoDialog.open(YesNoDialogComponent, dialogHelper.setYesNoConfig("This is a recurring event... What do you want to do?",
        `Deleting the event(s) will not delete the associated Attendance records, they must be deleted separately\nWhat do you want to do?`,
        "Delete all events",
        "Delete this event",
        "Cancel"
      ));
    } else {
      this.dialogRef = this.yesNoDialog.open(YesNoDialogComponent, dialogHelper.setYesNoConfig("Are you sure you wish to delete this event?",
        "Doing so will not delete the associated Attendance records, they must be deleted separately",
        "Yes",
        "",
        "No"
      ));
    }
  }

  deleteEvent() {
    let dialogHelper = new DialogHelperService();
    this.queryUserDelete(dialogHelper);
    this.dialogRef.afterClosed().subscribe((result) => {
      this.setLoadingState(true);
      switch (result) {
        case "Delete all events":
          this.attendaceService.deleteRecurringEvent(this.docId)
            .then(() => {
              this.inputForm.reset();
              this.router.navigate(["../"], { relativeTo: this.route });
            })
            .catch(() => alert("There was a problem deleting the events."))
            .finally(() => this.setLoadingState(false));
          break;
        case "Delete this event":
        case "Yes":
          this.attendaceService.deleteEvent(this.docId)
            .then(() => {
              this.inputForm.reset();
              this.router.navigate(["../"], { relativeTo: this.route });
            })
            .catch(() => alert("There was a problem deleting the event."))
            .finally(() => this.setLoadingState(false));
          break;
        default:
          this.setLoadingState(false);
          break;
      }
    });
  }

  toggleRecurrance(checked: boolean) {
    checked ? this.inputForm.get("recurranceType").enable() : this.inputForm.get("recurranceType").disable();
  }
}