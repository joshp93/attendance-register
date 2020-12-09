import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";


@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.scss']
})
export class RegistersComponent implements OnInit {
  displayedColumns: string[] = ['event', 'date'];
  dataSource: Observable<any>;

  constructor(private fs: AngularFirestore) { 
    this.getRegisters();
  }
  
  ngOnInit(): void {
  }

  getRegisters() {
    // TODO Snapshot changes
    this.fs.collection("registers").snapshotChanges().pipe(
      // map
    );
  }
}
