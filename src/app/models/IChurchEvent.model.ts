import firebase from "firebase/app";
export interface IChurchEvent {
    docId: string;
    eventId: string;
    name: string;
    date: firebase.firestore.Timestamp;
    recurring: boolean;
    recurranceType: string;
}
