import firebase from "firebase/app";
export interface IAttendance {
    email: string;
    event: string;
    date: firebase.firestore.Timestamp;
}
