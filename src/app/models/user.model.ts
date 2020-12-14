export class User {
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