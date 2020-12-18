import { Injectable, ElementRef } from '@angular/core';
import { ExportToCsv } from "export-to-csv";
import { Attendance } from '../models/Attendance.model';
import { ExportAttendance } from '../models/export-attendance';
import { IAttendance } from '../models/IAttendance.model';

const options = {
  fieldSeparator: ',',
  quoteStrings: '',
  decimalSeparator: '.',
  showLabels: true,
  showTitle: true,
  title: 'Record of Attendace',
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true,
  // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
};
@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  exportAttendanceToCsv(attendances: Attendance[]) {
    let exportAttendance = new Array<ExportAttendance>();
    attendances.forEach((attendance) => exportAttendance.push(new ExportAttendance(attendance)));
    
    let exportToCsv = new ExportToCsv(options);
    exportToCsv.generateCsv(exportAttendance);
  }
}
