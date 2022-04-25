import { IDto } from "..";

export class GameData implements IDto {
    title: string;
    id: string;

    constructor(title: string, id: string) {
        this.title = title;
        this.id = id;
    }
}