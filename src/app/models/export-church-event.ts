import { ChurchEvent } from './ChurchEvent.model';
export class ExportChurchEvent {
    id: string;
    name: string;
    date: string;

    constructor(churchEvent: ChurchEvent) {
        this.name = churchEvent.name;
        this.date = churchEvent.date.toDate().toLocaleDateString();
    }

    toString() {
        return this.id + ", " + this.name + ", " + this.date;
    }
}
