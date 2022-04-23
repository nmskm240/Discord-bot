import { DTO } from "..";

export class GameData extends DTO {
    title: string;
    id: string;

    constructor(title: string, id: string) {
        super();
        this.title = title;
        this.id = id;
    }
}