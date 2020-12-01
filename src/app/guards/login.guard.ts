import { Injectable } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoginGuard implements CanActivate {

  constructor(private auth: AngularFireAuth, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let storedEmail = localStorage.getItem('email');
    if (storedEmail != null && storedEmail != '') {
      this.auth.currentUser.then((user) => {
        if (user.email == storedEmail) {
          return true;
        }
      }); //TODO work out how to handle promise properties
    }
    this.router.navigate(['/login']);
    return false;
  }

}
