import firebase from "firebase/app";
import { IChurchEvent } from './IChurchEvent.model';
export class ChurchEvent implements IChurchEvent {
    docId: string;
    eventId: string;
    name: string;
    date: firebase.firestore.Timestamp;
    recurring: boolean;
    recurranceType: string;

    constructor(docId: string, eventId: string, name: string, date: Date, recurring: boolean, recurranceType: string) {
        this.docId = docId;
        this.eventId = eventId;
        this.name = name;
        this.date = firebase.firestore.Timestamp.fromDate(date);
        this.recurring = recurring;
        this.recurranceType = recurranceType;
    }

    toString() {
        return this.docId + ", " + this.eventId + ", " + this.name + ", " + this.date.toDate().toDateString() + ", " + this.recurring + ", " + this.recurranceType;
    }
}
