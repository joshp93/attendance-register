import { Injectable, ElementRef } from '@angular/core';
import * as FileSaver from "file-saver";
import * as xlsx from "xlsx";

const excelExtension = ".xlsx";

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  exportTableElmToExcel(element: ElementRef, fileName: string): void {
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(element.nativeElement);
    // generate workbook and add the worksheet
    const workbook: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, ws, 'Sheet1');
    // save to file
    xlsx.writeFile(workbook, `${fileName}${excelExtension}`);
  }
}
