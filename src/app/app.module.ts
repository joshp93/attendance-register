import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from 'src/environments/environment';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserSession } from './modules/user-session/user-session.module';
import { EventsComponent } from './components/events/events.component';
import { EventComponent } from './components/event/event.component';
import { ViewAttendanceComponent } from './components/view-attendance/view-attendance.component';
import { YesNoDialogComponent } from './components/yes-no-dialog/yes-no-dialog.component';
import { RecaptchaModule, RECAPTCHA_LANGUAGE } from "ng-recaptcha";
import { RECAPTCHA_SETTINGS, RecaptchaSettings } from "ng-recaptcha";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { RegisterAttendanceComponent } from './components/register-attendance/register-attendance.component';
import { MatSelectModule } from "@angular/material/select";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent,
    NavbarComponent,
    EventComponent,
    EventsComponent,
    RegisterAttendanceComponent,
    ViewAttendanceComponent,
    YesNoDialogComponent
  ],
  entryComponents: [
    YesNoDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTooltipModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDialogModule,
    RecaptchaModule
  ],
  providers: [
    UserSession,
    { provide: MatDialogRef, useValue: [] },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    { provide: RECAPTCHA_SETTINGS, useValue: { siteKey: environment.siteKey } as RecaptchaSettings },
    { provide: RECAPTCHA_LANGUAGE, useValue: environment.langauge },
    { provide: MAT_DATE_LOCALE, useValue: environment.langauge },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
