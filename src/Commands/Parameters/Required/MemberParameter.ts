import { GuildMember, Message } from "discord.js";
import { Parameter } from "../Parameter";

export class MemberParameter extends Parameter<GuildMember> {
    public setValue(message: Message, index: number): void {
        if (message.mentions.members && 0 < message.mentions.members.size) {
            this._value = message.mentions.members.array()[0];
            return;
        }
        throw new Error("not omittable parameter");
    }
}