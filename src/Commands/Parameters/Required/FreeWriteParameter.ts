import { Message } from "discord.js";
import { Command } from "../../Command";
import { Parameter } from "../Parameter";

export class FreeWriteParameter extends Parameter<string> {
    public setValue(message: Message, index: number): void {
        this._value = message.content.split(Command.PUNCTUATION)[index];
    }
}