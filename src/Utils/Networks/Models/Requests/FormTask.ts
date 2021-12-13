import { Channel, Client, Guild, GuildChannel, GuildMember, Message } from "discord.js";
import { FormType } from "../../..";
import { DTO } from "../DTO";

export class FormTask extends DTO {
    private _type: FormType;
    private _guild: Guild;
    private _channel: Channel;
    private _message: Message;
    private _creator: GuildMember;
    private _reactions: string[];
    private _endTime: Date;

    public get type(): FormType { return this._type; }
    public get message(): Message { return this._message; }
    public get creator(): GuildMember { return this._creator; }
    public get reactions(): string[] { return this._reactions; }
    public get endTime(): Date { return this._endTime; }

    constructor(type: FormType, guild: Guild, channel: Channel, message: Message, creator: GuildMember, endTime: Date, reactions: string[]) {
        super();
        this._type = type;
        this._guild = guild;
        this._channel = channel;
        this._message = message;
        this._creator = creator;
        this._endTime = endTime;
        this._reactions = reactions;
    }

    public static async parse(client: Client, obj: any): Promise<FormTask> {
        const guild: Guild = client.guilds.cache.get(obj.guild)
            ?? await client.guilds.fetch(obj.guild);
        const channel: GuildChannel | undefined = guild.channels.cache.get(obj.channel);
        if (!channel) {
            throw new Error("Nonexistent channel");
        } else if (!channel.isText()) {
            throw new Error("Invalid channel");
        }
        const message: Message = channel.messages.cache.get(obj.message)
            ?? await channel.messages.fetch(obj.message);
        const creator: GuildMember | undefined = guild.members.cache.get(obj.creator)
            ?? await guild.members.fetch(obj.creator);
        if (!creator) {
            throw new Error("Nonexistent creator");
        }
        return new FormTask(obj.type, guild, channel, message, creator, new Date(obj.endTime), obj.reactions);
    }
}