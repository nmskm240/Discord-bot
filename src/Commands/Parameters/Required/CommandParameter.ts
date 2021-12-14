import { Message } from "discord.js";
import { Command, CommandFactory } from "../..";
import { Parameter } from "../Parameter";

export class CommandParameter extends Parameter<Command> {
    protected _factory: CommandFactory;

    constructor(name: string, detail: string) {
        super(name, detail);
        this._factory = new CommandFactory();
    }

    public setValue(message: Message, index: number): void {
        const commandName = message.content.split(Command.PUNCTUATION)[index];
        const value = this._factory.create(commandName);
        if (!value) {
            throw Error("Arguments are missing.");
        }
        this._value = value;
    }
}