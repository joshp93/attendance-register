import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class UserSession {
  storeUserInfo(email: string) {
    localStorage.setItem('email', email);
  }
}
