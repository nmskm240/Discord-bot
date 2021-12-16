import { Message, MessageEmbed } from "discord.js";
import { CommandFactory, ExecutionInfo } from "../Commands";
import { Parameter } from "./Parameters/Parameter";

export abstract class Command {
    public readonly name: string = "";
    public readonly detail: string = "";
    public readonly parameters: Parameter<any>[] = [];
    protected _result: MessageEmbed | null = null;

    public get grammar(): string {
        return [
            Command.IDENTIFIER,
            this.name,
            this.parameters.map((p: Parameter<any>) => p.name).join(Command.PUNCTUATION)
        ].join(Command.PUNCTUATION);
    }
    public info: ExecutionInfo = new ExecutionInfo();

    public static readonly IDENTIFIER: string = ".nit";
    public static readonly PUNCTUATION: string = " ";

    constructor(name: string, detail: string, parameters: Parameter<any>[]) {
        this.name = name;
        this.detail = detail;
        this.parameters = parameters;
    }

    public static isCommand(content: string): boolean {
        return content.startsWith(Command.IDENTIFIER);
    }

    public static parse(message: Message): Command | null {
        if (Command.isCommand(message.content)) {
            const factory = new CommandFactory();
            const command = factory.create(message.content.split(Command.PUNCTUATION)[1]);
            if (command) {
                command.info.init(message);
                command.setParameters(message);
                return command;
            }
        }
        return null
    }

    private setParameters(message: Message): void {
        let i = 2;
        for (const parameter of this.parameters) {
            parameter.setValue(message, i);
            i++;
        }
    }

    public async send(): Promise<Message | undefined> {
        if (this.info.channel && this._result) {
            return await this.info.channel.send(this._result);
        }
    }

    public abstract execute(): Promise<void>
}