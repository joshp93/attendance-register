import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Attendance } from 'src/app/models/Attendance.model';
import { AttendanceService } from 'src/app/services/attendance-service.service';
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.component.html',
  styleUrls: ['./view-attendance.component.scss']
})
export class ViewAttendanceComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['email', 'event', 'date'];
  dataSource: Observable<Attendance[]>;
  attendances: Attendance[];
  emails: string[];
  inputForm: FormGroup;
  deleteDisabled: boolean;

  ngAfterViewInit() {
  }

  constructor(private attendanceService: AttendanceService, private fb: FormBuilder, private exportService: ExportService, private router: Router) {
    this.getAttenderEmails();
    this.getAttendance(null);
  }
  
  ngOnInit(): void {
    this.inputForm = this.fb.group({
      email: new FormControl(''),
    });
    this.deleteDisabled = true;
  }

  updateResults() {
    this.getAttendance(this.inputForm.value.email);
    this.updateDeleteDisabled();
  }

  updateDeleteDisabled() {
    this.deleteDisabled = this.inputForm.value.email ? false : true;
  }

  getAttendance(email?: string) {
    this.attendanceService.getAttendance(email).subscribe((results) => this.attendances = results);
  }

  getAttenderEmails() {
    this.attendanceService.getAttenderEmails().subscribe((results) => this.emails = results);
  }

  exportDataToExcel() {
    this.exportService.exportAttendanceToCsv(this.attendances);
  }

  close() {
    this.router.navigate(["home"]);
  }
}
