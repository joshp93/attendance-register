import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from "firebase/app";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class UserSession {
  
  constructor() { }
  
  storeUserInfo(user: firebase.User) {
    localStorage.setItem('email', user.email);
    localStorage.setItem('uid', user.uid);
  }

  getStoredUserInfo() {
    return {
      email: localStorage.getItem('email'),
      uid: localStorage.getItem('uid')
    }
  }
}
