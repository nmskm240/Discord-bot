import { DTO, Member } from ".."

export class Room implements DTO {
    info: { name: string, campus: string };
    inmates: Member[];

    constructor(name: string, campus: string, inmates: Member[]) {
        this.info = { name: name, campus: campus };
        this.inmates = inmates;
    }
}