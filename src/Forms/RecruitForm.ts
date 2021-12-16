import { GuildMember, MessageEmbed, MessageReaction } from "discord.js";
import { ReactionForm } from ".";
import { Team } from "../Utils";

export class RecruitForm extends ReactionForm {
    private _respondents: Team;
    private _isClose: boolean = false;

    public get isClose(): boolean {
        return this.isTimeOut || this._isClose;
    }

    constructor() {
        super();
        this._respondents = new Team("参加者");
    }

    protected onClose(embed: MessageEmbed): void {
        embed.title = "募集終了";
        embed.color = 0;
    }

    protected onUpdate(embed: MessageEmbed): void {
        const field = embed.fields[0];
        field.value = this._respondents.isEmpty ? "なし" : this._respondents.members.toString();
        embed.fields[0] = field;
    }

    private onReactionByJoin(member: GuildMember): void {
        this._respondents.add(member);
        if (this._respondents.isMax) {
            this._isClose = true;
        }
    }

    private onReactionByCancel(reaction: MessageReaction, member: GuildMember): void {
        this._respondents.remove(member);
        const userReactions = reaction.message.reactions.cache.filter((reaction: MessageReaction) => {
            return reaction.users.cache.has(member.id) &&
                this._task!.reactions.includes(reaction.emoji.name);
        });
        for (const reaction of userReactions.values()) {
            reaction.users.remove(member.id);
        }
    }

    private onReactionByClose(member: GuildMember): void {
        if (member.id == this._task!.creator.id) {
            this._isClose = true;
        }
    }

    protected onReacted(reaction: MessageReaction, reactionMember: GuildMember): void {
        if (reaction.emoji.name === this._task!.reactions[0]) {
            this.onReactionByJoin(reactionMember);
        }
        else if (reaction.emoji.name === this._task!.reactions[1]) {
            this.onReactionByCancel(reaction, reactionMember);
        }
        else {
            this.onReactionByClose(reactionMember);
        }
    }

    protected async onRebooted(): Promise<void> {
        for (const name of this._task!.reactions) {
            const reaction = this._task!.message.reactions.cache.get(name);
            if (!reaction) {
                throw new Error("Couldn't find reactions");
            }
            const users = reaction.users.cache ?? 
                await reaction.users.fetch();
            for (const user of users.filter(user => { return !user.bot; })) {
                const member = this._task!.message.guild?.member(user[1]);
                if (member) {
                    switch (this._task!.reactions.indexOf(name)) {
                        case 0:
                            this.onReactionByJoin(member);
                            break;
                        case 1:
                            this.onReactionByCancel(reaction, member);
                            break;
                        case 2:
                            this.onReactionByClose(member);
                            break;
                    }
                }
            }
        }
    }
}