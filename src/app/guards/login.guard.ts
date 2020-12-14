import { Injectable } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class LoginGuard implements CanActivate {

  constructor(private router: Router, private auth: AngularFireAuth) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.authState.pipe(map((user) => {
        return user ? true : this.redirectToLogin();
      })
    );
  }

  redirectToLogin(): boolean {
    this.router.navigate(['/login']);
    return false;
  }
}