import { Channel, Client, Guild, GuildChannel, GuildMember, Message, TextChannel } from "discord.js";
import { IDatabaseItem } from "../Database";

export class FormTask implements IDatabaseItem {
    private _guild: Guild;
    private _channel: Channel;
    private _message: Message;
    private _creator: GuildMember;
    private _endTime: Date;
    private _answerable: number;

    public get message(): Message { return this._message; }
    public get reactions(): object {
        return {
            allow: "✅",
            cancel: "❎",
            close: "✖",
        };
    }
    public get endTime(): Date { return this._endTime; }
    public get answerable(): number { return this._answerable; }

    constructor(message: Message, creator: GuildMember, endTime: Date, answerable: number) {
        this._guild = message.guild!;
        this._channel = message.channel!;
        this._message = message;
        this._creator = creator;
        this._endTime = endTime;
        this._answerable = answerable;
    }

    public toObject(): object {
        return {
            guild: this._guild.id,
            channel: this._channel.id,
            message: this._message.id,
            creator: this._creator.id,
            reactions: this.reactions,
            endTime: this.endTime,
            answerable: this.answerable,
        }
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
        return new FormTask(message, creator, new Date(obj.endTime), obj.answerable);
    }
}