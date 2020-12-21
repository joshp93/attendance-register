import { Injectable } from '@angular/core';
import { ExportToCsv } from "export-to-csv";
import { Attendance } from '../models/Attendance.model';
import { ChurchEvent } from '../models/ChurchEvent.model';
import { ExportAttendance } from '../models/export-attendance';
import { ExportChurchEvent } from '../models/export-church-event';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  exportAttendanceToCsv(attendances: Attendance[]) {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Record of Attendance',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
    
    let exportAttendance = new Array<ExportAttendance>();
    attendances.forEach((attendance) => exportAttendance.push(new ExportAttendance(attendance)));
    
    let exportToCsv = new ExportToCsv(options);
    exportToCsv.generateCsv(exportAttendance);
  }

  exportEventsToCsv(churchEvents: ChurchEvent[]) {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: '',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };

    let exportChurchEvents = new Array<ExportChurchEvent>();
    churchEvents.forEach((churchEvent) => exportChurchEvents.push(new ExportChurchEvent(churchEvent)));

    let exportToCsv = new ExportToCsv(options);
    exportToCsv.generateCsv(exportChurchEvents);
  }
}
