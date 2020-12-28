import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ChurchEvent } from 'src/app/models/ChurchEvent.model';
import { AttendanceService } from 'src/app/services/attendance-service.service';
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-registers',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['event', 'date'];
  events = new MatTableDataSource<ChurchEvent>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.events.paginator = this.paginator;
    this.events.sort = this.sort;
  }
  constructor(private router: Router, private attendanceService: AttendanceService, private exportService: ExportService) { 
    this.getEvents();
  }
  
  ngOnInit(): void {
  }

  getEvents() {
    this.attendanceService.getEventsWithIds().subscribe((results) => {
      this.events.data = results;
    });
  }

  Event() {
    this.router.navigate([this.router.url + "/event"]);
  }

  viewEvent(event) {
    this.router.navigateByUrl(this.router.url + "/event", { state: { docId: event.path[0].id as string } });
  }

  close() {
    this.router.navigate(["home"]);
  }

  exportDataToExcel() {
    this.exportService.exportEventsToCsv(this.events.data);
  }
}
