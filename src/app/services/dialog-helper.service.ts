import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { YesNoDialogComponent } from '../components/yes-no-dialog/yes-no-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogHelperService {

  constructor() { }

  setYesNoConfig(title: string, content: string, button1: string, button2: string, noButton: string): MatDialogConfig<YesNoDialogComponent> {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: title,
      content: content,
      button1: button1,
      button2: button2,
      noButton: noButton
    }
    return dialogConfig;
  }
}
