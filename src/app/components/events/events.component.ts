import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from '@angular/router';
import { Console } from 'console';
import { Observable } from "rxjs";


@Component({
  selector: 'app-registers',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  displayedColumns: string[] = ['event', 'date'];
  dataSource: Observable<any>;

  constructor(private fs: AngularFirestore, private router: Router) { 
    this.getEvents();
  }
  
  ngOnInit(): void {
  }

  getEvents() {
    this.dataSource = this.fs.collection("events").valueChanges();
  }

  addEvent() {
    this.router.navigate([this.router.url + "/add-event"]);
  }

  viewEvent(event) {
    console.log(event);
  }
}
