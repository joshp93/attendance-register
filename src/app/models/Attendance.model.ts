import firebase from "firebase/app";
export class Attendance {
    email: string;
    event: string;
    date: firebase.firestore.Timestamp;

    constructor(email: string, event: string, date: Date) {
        this.email = email;
        this.event = event;
        this.date = firebase.firestore.Timestamp.fromDate(date);
    }

    toString() {
        return this.email + ", " + this.event + ", " + this.date.toDate().toDateString();
    }
}
