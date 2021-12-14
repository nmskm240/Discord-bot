import { Channel, Client, Guild, GuildMember, Message, TextChannel } from "discord.js";
import { FormType } from "../../..";
import { DTO } from "../DTO";

export class FormTask extends DTO {
    public readonly type: FormType;
    public readonly guild: Guild;
    public readonly channel: Channel;
    public readonly message: Message;
    public readonly creator: GuildMember;
    public readonly reactions: string[];
    public readonly endTime: Date;

    constructor(type: FormType, guild: Guild, channel: Channel, message: Message, creator: GuildMember, endTime: Date, reactions: string[]) {
        super();
        this.type = type;
        this.guild = guild;
        this.channel = channel;
        this.message = message;
        this.creator = creator;
        this.endTime = endTime;
        this.reactions = reactions;
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
            type: this.type,
            ids: {
                guild: this.guild.id,
                channel: this.channel.id,
                message: this.message.id,
                creator: this.creator.id,
            },
            endtime: this.endTime,
            reactions: this.reactions
        };
    }
}