import { Channel, Client, Guild, GuildMember, Message, TextChannel } from "discord.js";
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

    static async parse(client: Client, data: any): Promise<FormTask> {
        const guild = client.guilds.cache.get(data.ids.guild) ??
            await client.guilds.fetch(data.ids.guild);
        const channel = guild.channels.cache.get(data.ids.channel) as TextChannel ??
            await client.channels.fetch(data.ids.channel) as TextChannel;
        const message = channel.messages.cache.get(data.ids.message) ?? 
            await channel.messages.fetch(data.ids.message);
        const creator = guild.members.cache.get(data.ids.creator) ?? 
            await guild.members.fetch(data.ids.creator);
        return new FormTask(data.type, guild, channel, message, creator, new Date(data.endtime), data.reactions);
    }

    toJSON() {
        return {
            type: this._type,
            ids: {
                guild: this._guild.id,
                channel: this._channel.id,
                message: this._message.id,
                creator: this._creator.id,
            },
            endtime: this._endTime,
            reactions: this._reactions
        };
    }
}