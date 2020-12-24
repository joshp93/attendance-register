import firebase from "firebase/app";
import { IChurchEvent } from './IChurchEvent.model';
export class ChurchEvent implements IChurchEvent {
    id: string;
    name: string;
    date: firebase.firestore.Timestamp;
    recurring: boolean;
    recurranceType: string;

    constructor(id: string, name: string, date: Date, recurring: boolean, recurranceType: string) {
        this.id = id;
        this.name = name;
        this.date = firebase.firestore.Timestamp.fromDate(date);
        this.recurring = recurring;
        this.recurranceType = recurranceType;
    }

    toString() {
        return this.id + ", " + this.name + ", " + this.date.toDate().toDateString() + ", " + this.recurring + ", " + this.recurranceType;
    }
}
