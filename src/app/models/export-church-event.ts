import { ChurchEvent } from './ChurchEvent.model';
export class ExportChurchEvent {
    eventId: string;
    name: string;
    date: string;

    constructor(churchEvent: ChurchEvent) {
        this.name = churchEvent.name;
        this.date = churchEvent.date.toDate().toLocaleDateString();
    }

    toString() {
        return this.eventId + ", " + this.name + ", " + this.date;
    }
}
