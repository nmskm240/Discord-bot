import { IQuery } from "../..";

export class Campus implements IQuery {
    campus: string = "";

    constructor(campus: string) {
        this.campus = campus;
    }

    toObject(): object {
        return {
            campus: this.campus
        }
    }
}