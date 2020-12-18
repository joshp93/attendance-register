import { Attendance } from "./Attendance.model";

export class ExportAttendance {
    email: string;
    event: string;
    date: string;

    constructor(attendance: Attendance) {
        this.email = attendance.email;
        this.event = attendance.event;
        this.date = attendance.date.toDate().toLocaleDateString();
    }
    
    toString() {
        return this.email + ", " + this.event + ", " + this.date;
    }
}

