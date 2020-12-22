import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
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
  attendances = new MatTableDataSource<Attendance>();
  emails: string[];
  inputForm: FormGroup;
  deleteDisabled: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.attendances.paginator = this.paginator;
    this.attendances.sort = this.sort;
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
    this.attendanceService.getAttendance(email).subscribe((results) => this.attendances.data = results);
  }

  getAttenderEmails() {
    this.attendanceService.getAttenderEmails().subscribe((results) => this.emails = results);
  }

  exportDataToExcel() {
    this.exportService.exportAttendanceToCsv(this.attendances.data);
  }

  close() {
    this.router.navigate(["home"]);
  }
}
