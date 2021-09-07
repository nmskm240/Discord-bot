import { Message } from "discord.js";
import { Command } from "../../Command";
import { Parameter } from "../Parameter";

export class NumberParameter extends Parameter<number> {
    private _rule: (value: number) => boolean;

    constructor(name: string, detail: string, rule: (value: number) => boolean) {
        super(name, detail);
        this._rule = rule;
    }

    public setValue(message: Message, index: number): void {
        const data = message.content.split(Command.PUNCTUATION)[index];
        const value = parseInt(data);
        if(isNaN(value) && this._rule(value)) {
            this._value = value;
            return;
        }
        throw new Error("Illegal parameter");
    }
}