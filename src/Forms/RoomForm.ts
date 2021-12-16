import { MessageEmbed, Client, User } from "discord.js";
import { Form } from ".";
import { RoomData } from "../Networks";

export class RoomForm extends Form {
    private _inmates: User[] = [];

    public static instance: RoomForm | null = null;

    constructor() {
        super();
        RoomForm.instance = this;
    }

    public get isClose(): boolean {
        return false;
    }

    public onPost(client: Client, room: RoomData): void {
        this._inmates.splice(0);
        const users = room.inmates.map((member) => {
            return client.users.cache.get(member.discordID);
        });
        for(const user of users) {
            if(user) {
                this._inmates.push(user);
            }
        }
        this.update();
    }

    protected async onRebooted(): Promise<void> {}

    protected onUpdate(embed: MessageEmbed): void {
        const field = embed.fields[0];
        field.value = this._inmates.length ? this._inmates.toString() : "なし";
        embed.fields[0] = field;
    }

    protected onClose(embed: MessageEmbed): void {
        RoomForm.instance = null;
    } 
}