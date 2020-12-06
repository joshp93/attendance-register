import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import firebase from "firebase/app";
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { logging } from 'protractor';
import { UserSession } from 'src/app/modules/user-session/user-session.module';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  email: String;
  loggedIn: boolean;

  constructor(private auth: AngularFireAuth, private router: Router, private userSession: UserSession) {

  }

  ngOnInit(): void {
    // TODO: EventEmitter for logged in state
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
}