import { IQuery } from "../IQuery";

export class FormTaskUpdate implements IQuery {
    method: string = "";

    constructor(method: string) {
        this.method = method;
    }

    toObject(): object {
        return {
            method: this.method
        };
    }
}