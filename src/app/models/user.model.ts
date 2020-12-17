import { IUser } from './IUser.Model';

export class User implements IUser {
    uid: string;
    email: string; 

    constructor(uid, email) {
        this.uid = uid;
        this.email = email;
    }

    toString() {
        return this.uid + ", " + this.email;
    }
}