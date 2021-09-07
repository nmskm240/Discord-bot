import { Message, MessageEmbed } from "discord.js";
import _ from "lodash";
import { CommandList, ExecutionInfo } from "../Commands";
import { Parameter } from "./Parameters/Parameter";

export abstract class Command {
    protected _name: string = "";
    protected _detail: string = "";
    protected _parameters: Parameter<any>[] = [];

    public get name(): string { return this._name; }
    public get detail(): string { return this._detail; }
    public get grammar(): string {
        return [
            Command.IDENTIFIER,
            this.name,
            this.parameters.map((p: Parameter<any>) => p.name).join(Command.PUNCTUATION)
        ].join(Command.PUNCTUATION);
    }
    public get parameters(): Parameter<any>[] { return this._parameters; }

    public info: ExecutionInfo = new ExecutionInfo();

    public static readonly IDENTIFIER: string = ".nit";
    public static readonly PUNCTUATION: string = " ";

    constructor(name: string, detail: string, parameters: Parameter<any>[]) {
        this._name = name;
        this._detail = detail;
        this._parameters = parameters;
    }

    public static clone(commandName: string): Command {
        const command: Command | undefined = _.cloneDeep(CommandList.get(commandName));
        if (command) {
            return command;
        } else {
            throw new Error("Unknown command");
        }
    }

    public static isCommand(content: string): boolean {
        return content.startsWith(Command.IDENTIFIER);
    }

    public static parse(message: Message): Command | null {
        if (Command.isCommand(message.content)) {
            let i = 2;
            const command: Command = Command.clone(message.content.split(Command.PUNCTUATION)[1]);
            command.info.init(message);
            for (const parameter of command.parameters) {
                parameter.setValue(message, i);
                i++;
            }
            return command;
        }
        return null
    }

    public abstract execute(): Promise<MessageEmbed>

    public async onComplite(message: Message): Promise<void> {}
}