import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  inputForm: FormGroup;
  @ViewChild("attendanceTable") attendaceTable: ElementRef;

  ngAfterViewInit() {

  }
  constructor(private attendanceService: AttendanceService, private fb: FormBuilder, private exportService: ExportService) {
    this.getAttendance(null);
  }

  ngOnInit(): void {
    this.inputForm = this.fb.group({
      email: new FormControl(''),
      event: new FormControl('')
    });
  }

  updateResults() {
    this.getAttendance(this.inputForm.value.email, this.inputForm.value.event);
  }

  getAttendance(email?: string, event?: string) {
    this.dataSource = this.attendanceService.getAttendance(email);
  }

  exportDataToExcel() {
    this.exportService.exportTableElmToExcel(this.attendaceTable, "Attendance")
  }
}
