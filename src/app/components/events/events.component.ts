import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { ChurchEvent } from 'src/app/models/ChurchEvent.model';
import { AttendanceService } from 'src/app/services/attendance-service.service';
import { ExportService } from 'src/app/services/export.service';


@Component({
  selector: 'app-registers',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  displayedColumns: string[] = ['event', 'date'];
  dataSource: Observable<ChurchEvent[]>;
  events: ChurchEvent[]

  constructor(private router: Router, private attendanceService: AttendanceService, private exportService: ExportService) { 
    this.getEvents();
  }
  
  ngOnInit(): void {
  }

  getEvents() {
    this.attendanceService.getEventsWithIds().subscribe((results) => {
      this.events = results;
    });
  }

  Event() {
    this.router.navigate([this.router.url + "/event"]);
  }

  viewEvent(event) {
    this.router.navigateByUrl(this.router.url + "/event", { state: { id: event.path[0].id as string } });
  }

  close() {
    this.router.navigate(["home"]);
  }

  exportDataToExcel() {
    this.exportService.exportEventsToCsv(this.events);
  }
}
