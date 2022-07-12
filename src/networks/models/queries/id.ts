import { Query } from "../..";

export class ID implements Query {
    id: string = "";

    constructor(id: string) {
        this.id = id;
    }

    toObject(): object {
        return {
            id: this.id
        };
    }
}