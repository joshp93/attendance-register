import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import firebase from "firebase/app";
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserSession } from 'src/app/modules/user-session/user-session.module';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  email: String;
  loggedIn: boolean;
  user$: Observable<firebase.User>;

  constructor(private auth: AngularFireAuth, private router: Router, private userSession: UserSession, private adapter: DateAdapter<any>) {
    this.user$ = auth.authState;
  }

  ngOnInit(): void {
  }

  logOut() {
    this.auth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      });
  }

  goHome() {
    this.router.navigate(["home"]);
  }

  setLocale(event) {
    this.adapter.setLocale(event.target.id);
  }
}