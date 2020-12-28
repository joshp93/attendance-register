import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map } from "rxjs/operators";
import { User } from '../models/user.model';
import { ChurchEvent } from '../models/ChurchEvent.model';
import { Attendance } from '../models/Attendance.model';
import { IAttendance } from '../models/IAttendance.model';
import firebase from "firebase/app";
import { IChurchEvent } from '../models/IChurchEvent.model';
import { start } from 'repl';

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
        this.updateUserData(user);
        this.router.navigate(['/home']);
        resolve(true);
      })
        .catch((res) => {
          alert(res.message);
          reject(false);
        });
    });
  }

  private updateUserData({ uid, email }: User) {
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
          let churchEvent = new ChurchEvent(a.payload.doc.id, a.payload.doc.data().eventId, a.payload.doc.data().name, a.payload.doc.data().date.toDate(), a.payload.doc.data().recurring, a.payload.doc.data().recurranceType);
          return churchEvent;
        });
      })
    );
  }

  getEvent(docId: string): Observable<ChurchEvent> {
    let eventsCol: AngularFirestoreCollection<ChurchEvent> = this.firestore.collection("events");

    return eventsCol.doc(docId).get().pipe(
      map(doc => {
        return new ChurchEvent(doc.id, doc.data().eventId, doc.data().name, doc.data().date.toDate(), doc.data().recurring, doc.data().recurranceType);
      })
    );
  }

  setEvent(churchEvent: ChurchEvent): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (churchEvent.recurring) {
        return this.createRecurringEvent(churchEvent);
      }
      churchEvent.recurranceType = "None";
      if (!churchEvent.docId) {
        churchEvent.docId = this.firestore.createId();
      }
      return this.firestore.collection("events").doc(churchEvent.docId).set(Object.assign({}, churchEvent))
        .then(() => resolve(true))
        .catch((reason) => console.error(reason));
    });
  }

   private async createRecurringEvent(churchEvent: ChurchEvent) {
    let eventCol: AngularFirestoreCollection<ChurchEvent> = this.firestore.collection("events");
    let batch = this.firestore.firestore.batch();
    let churchEvents = new Array<ChurchEvent>();
    let recurringEventId: string;
    let startFrom: number
    startFrom = 1;
    if (!churchEvent.docId) {
      recurringEventId = this.firestore.createId();
    } else {
      recurringEventId = churchEvent.docId;
      await this.firestore.collection("events").doc(churchEvent.docId).update(Object.assign({}, churchEvent))
        .catch((reason) => console.error(reason));
      startFrom++;
    }
    switch (churchEvent.recurranceType) {
      case "Daily": {
        for (let i = startFrom; i < 366; i++) {
          let ce = new ChurchEvent(this.firestore.createId(), recurringEventId, churchEvent.name, this.makeDateRecurringEventDate(churchEvent.date.toDate(), i), churchEvent.recurring, churchEvent.recurranceType);
          churchEvents.push(ce);
          this.addToBatch(batch, ce);
        }
        break;
      } case "Weekly": {
        for (let i = startFrom; i < 53; i++) {
          let ce = new ChurchEvent(this.firestore.createId(), recurringEventId, churchEvent.name, this.makeDateRecurringEventDate(churchEvent.date.toDate(), 0, i), churchEvent.recurring, churchEvent.recurranceType);
          churchEvents.push(ce);

          this.addToBatch(batch, ce);
        }
        break;
      } case "Monthly": {
        for (let i = startFrom; i < 13; i++) {
          let ce = new ChurchEvent(this.firestore.createId(), recurringEventId, churchEvent.name, this.makeDateRecurringEventDate(churchEvent.date.toDate(), 0, 0, i), churchEvent.recurring, churchEvent.recurranceType);
          churchEvents.push(ce);
          this.addToBatch(batch, ce);
        }
        break;
      }
    }
    return batch.commit();
  }

  setRecurringEvent(churchEvent: ChurchEvent): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {

      let batch = this.firestore.firestore.batch();
      this.addEventsToSetBatch(batch, churchEvent)
        .then(() => {
          batch.commit()
            .then(() => resolve(true))
            .catch((reason) => {
              console.error(reason);
              reject(false);
            });
        });
    });
  }

  private addEventsToSetBatch(batch: firebase.firestore.WriteBatch, churchEvent: ChurchEvent): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let eventsCol: AngularFirestoreCollection<ChurchEvent> = this.firestore.collection("events", ref => ref.where("eventId", "==", churchEvent.eventId));
      eventsCol.get().subscribe(
        (snapshot) => {
          snapshot.docs.forEach((doc) => {
            batch.update(doc.ref, <IChurchEvent>{
              name: churchEvent.name
            });
          });
          resolve(true);
        },
        (error) => {
          console.error(error);
          reject(false);
        }
      );
    });
  }

  private makeDateRecurringEventDate(originalEventDate: Date, addDays?: number, addWeeks?: number, addMonths?: number) {
    let newDate = originalEventDate;
    if (addWeeks) {
      let newDate = originalEventDate;
      newDate.setDate((originalEventDate.getDate() + (addWeeks - 1) * 7));
    } else {
      if (addMonths) {
        let newMonth = (newDate.getMonth() + (addMonths - 1));
        let eventDate = this.setEventDay(newDate.getFullYear(), newMonth, newDate.getDate());
        if (newMonth >= 12) {
          newDate.setFullYear(newDate.getFullYear() + 1, (newMonth - 12), eventDate);
        } else {
          newDate.setMonth(newDate.getMonth() + (addMonths - 1), eventDate);
        }
      } else if (addDays) {
        newDate.setDate(newDate.getDate() + (addDays - 1));
      }
    }
    return new Date(newDate);
  }

  private setEventDay(fullYear: number, month: number, date: number): number {
    month--;
    if (month >= 11) {
      fullYear++;
      month = month - 11;
    }

    let eventDay = date;
    if ((this.isFebruary(month) && date > 28) ||
      (this.isThirtyMonth(month) && date > 30)) {
      eventDay = new Date(fullYear, month + 1, 0).getDate();
    }
    return eventDay;
  }

  private isThirtyMonth(month: number) {
    if (month == 8 ||
      month == 9 ||
      month == 3 ||
      month == 5) {
      return true;
    } else {
      return false;
    }
  }

  private isFebruary(month) {
    return month == 1 ? true : false;
  }

  private addToBatch(batch: firebase.firestore.WriteBatch, churchEvent: ChurchEvent) {
    let eventDoc: AngularFirestoreDocument<IChurchEvent> = this.firestore.collection("events").doc(churchEvent.docId);
    let eventRef: DocumentReference<IChurchEvent> = eventDoc.ref;

    batch.set(eventRef, {
      docId: churchEvent.docId,
      eventId: churchEvent.eventId,
      name: churchEvent.name,
      date: churchEvent.date,
      recurring: churchEvent.recurring,
      recurranceType: churchEvent.recurranceType
    });
  }

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

  getEventsOnDate(date: Date): Observable<ChurchEvent[]> {
    let startDate = new Date(date.toDateString());
    let endDate = date;
    endDate.setHours(23, 59, 59, 999);
    let eventsCol: AngularFirestoreCollection<ChurchEvent> = this.firestore.collection("events", ref => ref
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
    );

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

  deleteEvent(docId: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.firestore.collection("events").doc(docId).delete()
        .then(() => resolve(true))
        .catch((reason) => {
          console.error(reason);
          reject(false);
        });
    });
  }

  deleteRecurringEvent(docId: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {

      this.getEvent(docId).subscribe(
        (result) => {
          let recurringEventId = result.eventId;
          let batch = this.firestore.firestore.batch();
          this.addEventsToDeleteBatch(batch, recurringEventId)
            .then(() => {
              batch.commit()
                .then(() => resolve(true))
                .catch((reason) => {
                  console.error(reason);
                  reject(false);
                });
            });
        },
        (error) => {
          console.error(error);
          reject(false);
        });

    });
  }

  private addEventsToDeleteBatch(batch: firebase.firestore.WriteBatch, recurringEventId: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {

      let eventsCol: AngularFirestoreCollection<ChurchEvent> = this.firestore.collection("events", ref => ref.where("eventId", "==", recurringEventId));
      eventsCol.get().subscribe(
        (snapshot) => {
          snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
          });
          resolve(true);
        },
        (error) => {
          console.error(error);
          reject(false);
        }
      );

    });
  }
}