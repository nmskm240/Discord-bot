import { IDto, MemberData } from ".."

export class RoomData implements IDto {
    info: { name: string, campus: string };
    inmates: MemberData[];

    constructor(name: string, campus: string, inmates: MemberData[]) {
        this.info = { name: name, campus: campus };
        this.inmates = inmates;
    }
}