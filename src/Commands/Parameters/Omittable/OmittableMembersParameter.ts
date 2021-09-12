import { GuildMember, Message } from "discord.js";
import { MembersParameter } from "..";
import { IOmittable } from "../IOmittable";

export class OmittableMembersParameter extends MembersParameter implements IOmittable<GuildMember[]> {
    public default: GuildMember[];

    constructor(name: string, detail: string, defaultValue: GuildMember[]) {
        super(name, detail);
        this.default = defaultValue;
    }

    public setValue(message: Message, index: number): void {
        try {
            super.setValue(message, index);
        } catch (error) {
            this._value = this.default;
        }
    }
}