import { Message } from "discord.js";
import { Command } from "../../Command";
import { Parameter } from "../Parameter";

export class CommandParameter extends Parameter<Command> {
    public setValue(message: Message, index: number): void {
        const commandName = message.content.split(Command.PUNCTUATION)[index];
        this._value = Command.clone(commandName);
    }
}