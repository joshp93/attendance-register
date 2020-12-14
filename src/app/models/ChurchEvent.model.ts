export class ChurchEvent {
    id: string;
    name: string;
    date: Date;

    constructor(id: string, name: string, date: Date) {
        this.id = id;
        this.name = name;
        this.date = date;
    }

    toString() {
        return this.id + ", " + this.name + ", " + this.date.toDateString();
    }
}
