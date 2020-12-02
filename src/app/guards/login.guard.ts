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
    state: RouterStateSnapshot): boolean | Promise<boolean> {
    let storedInfo = this.userSession.getStoredUserInfo();
    if (storedInfo.email && storedInfo.uid) {
      return new Promise<boolean>((resolve, reject) => {
        this.auth.currentUser
        .then((res) => {
          if (!res) {
            reject(this.redirectToLogin());
          } else if (storedInfo.uid == res.uid) {
            resolve(true);
          } else {
            reject(this.redirectToLogin());
          }
        })
        .catch((res) => {
          reject(this.redirectToLogin());
        });
      });
    } else {
      return this.redirectToLogin();
    }
  }

  redirectToLogin(): boolean {
    this.userSession.clearStoredUserInfo();
    this.router.navigate(['/login']);
    return false;
  }
}
