import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
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

  // TODO - Get attendance
  setAttendance(attendance: Attendance): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {

      let attDoc: AngularFirestoreDocument<IAttendance> = this.firestore.collection("attendances").doc(attendance.toString());
      attDoc.set({
        email: attendance.email,
        event: attendance.event,
        date: attendance.date
      })
        .then(() => resolve(true))
        .catch((reason) => {
          console.error(reason);
          reject(false);
        });

    });
  }

  getEvents(): Observable<ChurchEvent[]> {
    let eventsCol: AngularFirestoreCollection<ChurchEvent> = this.firestore.collection("events");
    return eventsCol.valueChanges();
  }

  getAvailableDatesForEvent(event: string): string[] {
    let eventsCol: AngularFirestoreCollection<ChurchEvent> = this.firestore.collection("events", ref => ref.where("name", "==", event));
    let availableDates = new Array<string>();

    eventsCol.valueChanges().forEach((churchEvents) => {
      churchEvents.forEach((churchEvent) => {
        availableDates.push(churchEvent.date.toDate().toDateString());
      })
    });
    return availableDates;
  }

  getAttendance(email: string | null): Observable<Attendance[]> {
    let attendanceCol: AngularFirestoreCollection<Attendance> = (email ? this.firestore.collection("attendances", ref => ref.where('email', '==', email)) : this.firestore.collection("attendances"));
    return attendanceCol.get().pipe(
      map((querySnap) => {
        let attendances = new Array<Attendance>();
        querySnap.docs.forEach((doc) => {
          attendances.push(new Attendance(doc.data().email, doc.data().event, doc.data().date.toDate()));
        });
        return attendances;
      })
    );
  }

  getAttenderEmails(): Observable<string[]> {
    let emailsCol: AngularFirestoreCollection<Attendance> = this.firestore.collection("attendances");

    return emailsCol.valueChanges().pipe(
      map(docs => {
        let emails = new Map<string, string>();
        emails.set("", ""); //Add blank option
        docs.forEach((doc) => {
          !emails.has(doc.email) ? emails.set(doc.email, doc.email) : null;
        });
        return Array.from(emails.values());
      })
    )
  }

  deleteEvent(eventId: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.firestore.collection("events").doc(eventId).delete()
        .then(() => resolve(true))
        .catch((reason) => {
          console.error(reason);
          reject(false);
        });
    });
  }
}