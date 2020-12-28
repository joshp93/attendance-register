import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrls: ['./yes-no-dialog.component.scss']
})
export class YesNoDialogComponent implements OnInit {
  title: string;
  content: string;
  button1: string;
  button2: string;
  noButton: string;

  constructor(private dialogRef: MatDialogRef<YesNoDialogComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.title = data.title ? data.title : "Are you sure you wish to continue?";
    this.content = data.content ? data.content : "";
    this.button1 = data.button1 ? data.button1 : "Yes";
    this.button2 = data.button2 ? data.button2 : "";
    this.noButton = data.noButton ? data.noButton : "No";
  }

  ngOnInit(): void {
  }

  button1Click() {
    this.dialogRef.close(this.button1);
  }
  button2Click() {
    this.dialogRef.close(this.button2);
  }
  noButtonClick() {
    this.dialogRef.close("No");
  }
}
