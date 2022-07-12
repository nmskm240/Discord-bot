import { DTO } from "..";

export class Game implements DTO {
    title: string;
    id: string;

    constructor(title: string, id: string) {
        this.title = title;
        this.id = id;
    }
}