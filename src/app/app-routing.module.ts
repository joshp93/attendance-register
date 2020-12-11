import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginGuard } from './guards/login.guard';
import { EventsComponent } from './components/events/events.component';
import { RegisterAttendanceComponent } from './components/register-attendance/register-attendance.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home/events', component: EventsComponent, canActivate: [LoginGuard] },
  { path: 'home/events/add-event', component: AddEventComponent, canActivate: [LoginGuard] },
  { path: 'home/register-attendance', component: RegisterAttendanceComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
