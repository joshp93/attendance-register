import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map } from "rxjs/operators";
import { User } from '../models/user.model';
import { IUser } from "../models/IUser.Model";
import { UserSession } from '../modules/user-session/user-session.module';
import { ChurchEvent } from '../models/churchEvent.model';
import { Attendance } from '../models/attendance';
import { resolve } from 'dns';
import { promise } from 'protractor';
import { rejects } from 'assert';

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

  getEvents() {
    let eventsCol: AngularFirestoreCollection<ChurchEvent> = this.firestore.collection("events");
    let churchEvents = Array<ChurchEvent>();

    return eventsCol.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          let churchEvent = new ChurchEvent(a.payload.doc.id, a.payload.doc.data().name, a.payload.doc.data().date)
          return churchEvent;
        });
      })
    );
  }

  getEvent(eventId: string): Observable<ChurchEvent> {
    let eventsCol: AngularFirestoreCollection<ChurchEvent> = this.firestore.collection("events");

    return eventsCol.doc(eventId).get().pipe(
      map(doc => {
        return new ChurchEvent(doc.id, doc.data().name, doc.data().date);
      })
    );
  }

  setEvent(churchEvent: ChurchEvent) {
    if (!churchEvent.id) {
      churchEvent.id = this.firestore.createId();
    }
    return this.firestore.collection("events").doc(churchEvent.id).set(Object.assign({}, churchEvent), { merge: true });
  }

  getAttendance(attendance: Attendance): Promise<boolean> {
    let attEventDoc: AngularFirestoreDocument<string> = this.firestore.collection("attendaces")
      .doc(attendance.email).collection("dates").doc(attendance.date.toDate().toDateString())
      .collection("attendanceEvents").doc(attendance.event);

    return new Promise<boolean>((resolve, reject) => {
      attEventDoc.get().toPromise()
        .then((doc) => {
          doc ? resolve(true) : resolve(false);
        })
        .catch((reason) => reject(false));
    });
  }

  setAttendance(attendance: Attendance) {
    // check that the attendance hasn't already been registered
    this.getAttendance(attendance)
      .then((exists) => {
        if (exists == false) {
          let attEventDoc: AngularFirestoreDocument<string> = this.firestore.collection("attendaces")
            .doc(attendance.email).collection("dates").doc(attendance.date.toDate().toDateString())
            .collection("attendanceEvents").doc(attendance.event);
          
          attEventDoc.set(attendance.event)
            .catch((reason) => console.log(reason));
        } else {
          alert(`You are already registered for ${attendance.event} on ${attendance.date}`);
        }
      });
  }
}
