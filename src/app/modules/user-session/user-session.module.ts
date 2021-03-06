import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from "firebase/app";
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class UserSession {

  constructor() {
  }

  setStoredUserInfo(user: firebase.User) {
    localStorage.setItem('email', user.email);
    localStorage.setItem('uid', user.uid);
  }

  getStoredUserInfo() {
    return {
      email: localStorage.getItem('email'),
      uid: localStorage.getItem('uid')
    }
  }

  clearStoredUserInfo() {
    localStorage.clear();
  }
}
