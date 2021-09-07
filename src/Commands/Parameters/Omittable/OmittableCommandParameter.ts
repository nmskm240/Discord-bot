import { Message } from "discord.js";
import { IOmittable } from "../IOmittable";
import { Command } from "../../Command";
import { CommandParameter } from "..";

export class OmittableCommandParameter extends CommandParameter implements IOmittable<Command> {
    public default: Command;

    constructor(name: string, detail: string, defaultValue: Command) {
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