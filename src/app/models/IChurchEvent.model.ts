import firebase from "firebase/app";
export interface IChurchEvent {
    id: string;
    name: string;
    date: firebase.firestore.Timestamp;
}
