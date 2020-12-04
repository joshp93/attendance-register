import { Injectable } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserSession } from '../modules/user-session/user-session.module';
import firebase from "firebase/app";

@Injectable({
  providedIn: 'root'
})

export class LoginGuard implements CanActivate {

  constructor(private router: Router, private auth: AngularFireAuth, private userSession: UserSession) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    let storedInfo = this.userSession.getStoredUserInfo();
    if (storedInfo.email && storedInfo.uid) {

      return new Promise<boolean>((resolve, reject) => {
        this.getCurrentUser()
          .then((res) => {
            this.userSession.setStoredUserInfo(res);
            resolve(true);
            console.log("first resolve");
          })
          .catch((res) => {
            reject(this.redirectToLogin());
            console.log("first reject");
          });
      });

    } else {

      return new Promise<boolean>((resolve, reject) => {
        this.getCurrentUser()
          .then((res) => {
            this.userSession.setStoredUserInfo(res);
            resolve(true);
            console.log("second resolve");
          })
          .catch((res) => {
            reject(this.redirectToLogin());
            console.log("second reject");
          });
      });

    }
  }

  redirectToLogin(): boolean {
    this.userSession.clearStoredUserInfo();
    this.router.navigate(['/login']);
    return false;

  }
  getCurrentUser(): Promise<firebase.User> {
    return new Promise<firebase.User>((resolve, reject) => {
      this.auth.currentUser
        .then((res) => {
          if (!res) {
            reject(res);
          } else {
            resolve(res);
          }
        })
        .catch((res) => {
          reject(res);
        });
    });
  }
}