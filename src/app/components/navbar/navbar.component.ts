import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import firebase from "firebase/app";
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user$: Observable<firebase.User>;

  constructor(private auth: AngularFireAuth, private router: Router) { 
    this.user$ = auth.authState;
  }

  ngOnInit(): void {
  }

  logOut() {
    this.auth.signOut()
    .then(() => {
      this.router.navigate(['/login']);
    })
  }
}