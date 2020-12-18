import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from '@angular/router';
import { Console } from 'console';
import { Observable } from "rxjs";
import { ChurchEvent } from 'src/app/models/ChurchEvent.model';
import { AttendanceService } from 'src/app/services/attendance-service.service';


@Component({
  selector: 'app-registers',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  displayedColumns: string[] = ['event', 'date'];
  dataSource: Observable<ChurchEvent[]>;

  constructor(private router: Router, private attendanceService: AttendanceService) { 
    this.getEvents();
  }
  
  ngOnInit(): void {
  }

  getEvents() {
    this.dataSource = this.attendanceService.getEventsWithIds(); 
  }

  addEvent() {
    this.router.navigate([this.router.url + "/add-event"]);
  }

  viewEvent(event) {
    this.router.navigateByUrl(this.router.url + "/add-event", { state: { id: event.path[0].id as string } });
  }

  close() {
    this.router.navigate(["home"]);
  }
}
