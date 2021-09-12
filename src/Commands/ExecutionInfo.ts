import { Channel, Guild, GuildMember, Message } from "discord.js";

export class ExecutionInfo {
    private _performer: GuildMember | null;
    private _guild: Guild | null;
    private _channel: Channel | null;
    private _message: Message | null;
    private _timestamp: Date | null;

    public get performer(): GuildMember | null {
        return this._performer;
    }
    public get guild(): Guild | null {
        return this._guild;
    }
    public get channel(): Channel | null {
        return this._channel;
    }
    public get message(): Message | null {
        return this._message;
    }

    public get timestamp(): Date | null {
        return this._timestamp;
    }

    constructor() {
        this._performer = null;
        this._guild = null;
        this._channel = null;
        this._message = null;
        this._timestamp = null;
    }

    public init(message: Message): void {
        this._performer = message.member;
        this._guild = message.guild;
        this._channel = message.channel;
        this._message = message;
        this._timestamp = new Date();
    }
}