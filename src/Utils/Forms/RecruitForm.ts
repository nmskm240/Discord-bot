import { GuildMember, MessageEmbed, MessageReaction, User } from "discord.js";
import { Form, Team } from "..";
import { FormTask } from "../Networks/Models/Requests/FormTask";

export class RecruitForm extends Form {
    private _respondents: Team;

    constructor(task: FormTask) {
        super(task);
        this._respondents = new Team("参加者");
    }

    public toMessageEmbed(): MessageEmbed {
        throw new Error("Method not implemented.");
    }

    protected onUpdate(embed: MessageEmbed): void {
        const field = embed.fields[0];
        field.value = this._respondents.isEmpty ? "なし" : this._respondents.members.toString();
        embed.fields[0] = field;
    }

    protected onClosed(embed: MessageEmbed): void {
        embed.title = "募集終了";
        embed.color = 0;
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
                this._task.reactions.includes(reaction.emoji.name);
        });
        for (const reaction of userReactions.values()) {
            reaction.users.remove(member.id);
        }
    }

    private onReactionByClose(member: GuildMember): void {
        if (member.id == this._task.creator.id) {
            this._isClose = true;
        }
    }

    protected onReacted(reaction: MessageReaction, reactionMember: GuildMember): void {
        if (reaction.emoji.name === this._task.reactions[0]) {
            this.onReactionByJoin(reactionMember);
        }
        else if (reaction.emoji.name === this._task.reactions[1]) {
            this.onReactionByCancel(reaction, reactionMember);
        }
        else {
            this.onReactionByClose(reactionMember);
        }
    }

    protected async onRebooted(): Promise<void> {
        for (const name of this._task.reactions) {
            const reaction = this._task.message.reactions.cache.get(name);
            if (!reaction) {
                throw new Error("Couldn't find reactions");
            }
            const users = reaction.users.cache.array();
            for (const user of users.filter(user => { return !user.bot; })) {
                const member = this._task.message.guild?.member(user);
                if (member) {
                    switch (this._task.reactions.indexOf(name)) {
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