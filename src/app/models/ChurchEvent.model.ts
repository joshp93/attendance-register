import firebase from "firebase/app";
import { IChurchEvent } from './IChurchEvent.model';
export class ChurchEvent implements IChurchEvent {
    id: string;
    name: string;
    date: firebase.firestore.Timestamp;

    constructor(id: string, name: string, date: Date) {
        this.id = id;
        this.name = name;
        this.date = firebase.firestore.Timestamp.fromDate(date);
    }

    toString() {
        return this.id + ", " + this.name + ", " + this.date.toDate().toDateString();
    }
}
