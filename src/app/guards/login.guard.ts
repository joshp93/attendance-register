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

  constructor(private router: Router, private auth: AngularFireAuth) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | Promise<boolean> {
    let userSession = new UserSession();
    let storedInfo = userSession.getStoredUserInfo();
    if (storedInfo.email && storedInfo.uid) {
      return new Promise<boolean>((resolve, reject) => {
        this.auth.currentUser
        .then((res) => {
          if (storedInfo.uid == res.uid) {
            resolve(true);
          } else {
            reject(this.redirectToLogin());
          }
        })
        .catch(() => {
          reject(this.redirectToLogin());
        });
      });
    } else {
      return this.redirectToLogin();
    }
  }

  redirectToLogin(): boolean {
    this.router.navigate(['/login']);
    return false;
  }
}
