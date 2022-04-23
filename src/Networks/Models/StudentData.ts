import { DTO } from "..";

export class StudentData extends DTO {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        super();
        this.id = id;
        this.name = name;
    }
}