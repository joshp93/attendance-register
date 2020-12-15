import firebase from "firebase/app";
export class ChurchEvent {
    id: string;
    name: string;
    date: firebase.firestore.Timestamp;

    constructor(id: string, name: string, date: firebase.firestore.Timestamp) {
        this.id = id;
        this.name = name;
        this.date = date;
    }

    toString() {
        return this.id + ", " + this.name + ", " + this.date.toDate().toDateString();
    }
}
