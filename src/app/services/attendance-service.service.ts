import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from "rxjs/operators";
import { User } from "../models/user.model";
import { UserSession } from '../modules/user-session/user-session.module';

@Injectable({
  providedIn: 'root'
})
export class AttendanceServiceService {
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

  singIn(email, password) {
    this.auth.signInWithEmailAndPassword(email, password).then((res) => {
      let userSession = new UserSession();
      userSession.setStoredUserInfo(res.user);
      this.router.navigate(['/home']);
    })
    .catch((res) => {
      alert(res.message);
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

  }
}
