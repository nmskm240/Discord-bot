import { GuildBasedChannel, GuildChannel, GuildMember, Permissions, Role, VoiceState } from "discord.js";

export class VCC {
    private _voiceState: VoiceState;

    public get name(): string {
        return this._voiceState.channel?.name.replace(/ |　|[！-～]/g, "-").toLowerCase()
            + VCC.IDENTIFIER;
    }
    public get role(): Promise<Role> {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(this._voiceState.guild.roles.cache.find((role) =>
                    role.name == this.name)
                    ?? await this._voiceState.guild.roles.create({ name: this.name })
                )
            } catch (e) {
                throw new Error("Can't create of get role");
            }
        });
    }
    public get channel(): GuildBasedChannel | undefined {
        return this._voiceState.guild.channels.cache.find((channel) =>
            channel.name == this.name);
    }

    public static readonly IDENTIFIER: string = "_vcc";

    constructor(voiceState: VoiceState) {
        this._voiceState = voiceState;
    }

    public static isConnectedVC(oldState: VoiceState, newState: VoiceState): boolean {
        return (!oldState.channel && newState.channel) ? true : false;
    }

    public static isLeavedVC(oldState: VoiceState, newState: VoiceState): boolean {
        return (oldState.channel && !newState.channel) ? true : false;
    }

    public static isSwitchedVC(oldState: VoiceState, newState: VoiceState): boolean {
        return oldState.channel?.id != newState.channel?.id;
    }

    public async create(): Promise<GuildChannel> {
        return await this._voiceState.guild.channels.create(this.name, {
            permissionOverwrites: [
                { id: this._voiceState.guild.roles.everyone, deny: Permissions.FLAGS.VIEW_CHANNEL },
                { id: await this.role, allow: Permissions.FLAGS.VIEW_CHANNEL },
                { id: this._voiceState.client.user!, allow: Permissions.FLAGS.VIEW_CHANNEL },
            ]
        })
    }

    public async isViewableMember(member: GuildMember): Promise<boolean> {
        const needRole = await this.role;
        return member.roles.cache.find((role) => role.id == needRole.id) ? true : false;
    }

    public async join(member: GuildMember): Promise<void> {
        if (!await this.isViewableMember(member)) {
            await member.roles.add(await this.role);
        }
    }

    public async leave(member: GuildMember): Promise<void> {
        if (await this.isViewableMember(member)) {
            await member.roles.remove(await this.role);
        }
    }
}