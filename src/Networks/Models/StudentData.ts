import { IDto } from "..";

export class StudentData implements IDto {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}