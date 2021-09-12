import { GuildMember, Message } from "discord.js";
import { MemberParameter } from "..";
import { IOmittable } from "../IOmittable";

export class OmittableMemberParameter extends MemberParameter implements IOmittable<GuildMember | null> {
    public default: GuildMember | null;

    constructor(name: string, detail: string, defaultValue: GuildMember | null) {
        super(name, detail);
        this.default = defaultValue;
    }

    public setValue(message: Message, index: number): void {
        try {
            super.setValue(message, index);
        } catch (error) {
            this._value = this.default ? this.default : message.member!;;
        }
    }
}