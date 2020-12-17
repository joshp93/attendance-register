import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map } from "rxjs/operators";
import { User } from '../models/user.model';
import { ChurchEvent } from '../models/ChurchEvent.model';
import { Attendance } from '../models/Attendance.model';
import { IAttendance } from '../models/IAttendance.model';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  user$: Observable<User>;

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) {
    this.user$ = auth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )
  }

  logIn(email, password): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(email, password).then((res) => {
        let user = new User(res.user.uid, res.user.email);
        this.updateUserDate(user);
        this.router.navigate(['/home']);
        resolve(true);
      })
        .catch((res) => {
          alert(res.message);
          reject(false);
        });
    });
  }

  private updateUserDate({ uid, email }: User) {
    const userRef: AngularFirestoreDocument<User> = this.firestore.doc(`users/${uid}`);

    const data = {
      uid,
      email
    };
    return userRef.set(data, { merge: true });
  }

  getEventsWithIds() {
    let eventsCol: AngularFirestoreCollection<ChurchEvent> = this.firestore.collection("events");
    let churchEvents = Array<ChurchEvent>();

    return eventsCol.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          let churchEvent = new ChurchEvent(a.payload.doc.id, a.payload.doc.data().name, a.payload.doc.data().date.toDate())
          return churchEvent;
        });
      })
    );
  }

  getEvent(eventId: string): Observable<ChurchEvent> {
    let eventsCol: AngularFirestoreCollection<ChurchEvent> = this.firestore.collection("events");

    return eventsCol.doc(eventId).get().pipe(
      map(doc => {
        return new ChurchEvent(doc.id, doc.data().name, doc.data().date.toDate());
      })
    );
  }

  setEvent(churchEvent: ChurchEvent) {
    if (!churchEvent.id) {
      churchEvent.id = this.firestore.createId();
    }
    return this.firestore.collection("events").doc(churchEvent.id).set(Object.assign({}, churchEvent), { merge: true });
  }

  // getAttendance(attendance: Attendance): Promise<any> {
  //   let attEventDoc: AngularFirestoreDocument = this.firestore.collection("attendaces")
  //     .doc(attendance.email).collection("dates").doc(attendance.date.toDate().toDateString())
  //     .collection("attendanceEvents").doc(attendance.event);

  //   return new Promise<any>((resolve, reject) => {
  //     attEventDoc.get().toPromise()
  //       .then((doc) => {
  //         resolve(doc);
  //       })
  //       .catch((reason) => reject(reason));
  //   });
  // }

  async setAttendance(attendance: Attendance) {
    let attDoc: AngularFirestoreDocument<IAttendance> = this.firestore.collection("attendances").doc(attendance.toString());
    attDoc.set({
      email: attendance.email,
      event: attendance.event,
      date:attendance.date
    })
    .catch((reason) => console.error(reason));
  }

  getEvents(): Observable<ChurchEvent[]> {
    let eventsCol: AngularFirestoreCollection<ChurchEvent> = this.firestore.collection("events");
    return eventsCol.valueChanges();
  }
}
