import { GuildMember, Message, MessageReaction, User } from "discord.js";
import { memoize } from "lodash";
import { Form } from "..";

export class RecruitForm extends Form {
    private onJoin(member: GuildMember): void {
        this._respondents.add(member);
        if (this._respondents.isMax) {
            this._isClose = true;
        }
    }

    private onCancel(reaction: MessageReaction, member: GuildMember): void {
        this._respondents.remove(member);
        const userReactions = reaction.message.reactions.cache.filter((reaction: MessageReaction) => {
            return reaction.users.cache.has(member.id) &&
                this._task.reactions.includes(reaction.emoji.name);
        });
        for (const reaction of userReactions.values()) {
            reaction.users.remove(member.id);
        }
    }

    private onClose(member: GuildMember): void {
        if (member.id == this._task.creator.id) {
            this._isClose = true;
            return;
        }
    }

    protected onReacted(reaction: MessageReaction, reactionMember: GuildMember): void {
        if (reaction.emoji.name === this._task.reactions[0]) {
            this.onJoin(reactionMember);
        }
        else if (reaction.emoji.name === this._task.reactions[1]) {
            this.onCancel(reaction, reactionMember);
        }
        else {
            this.onClose(reactionMember);
        }
    }

    protected async onRebooted(): Promise<void> {
        for (const name of this._task.reactions) {
            const reaction = this._task.message.reactions.cache.get(name);
            if (!reaction) {
                throw new Error("Couldn't find reactions");
            }
            const users: User[] = (reaction.users.cache
                ?? await reaction.users.fetch()).array();
            console.log(users);
            for (const user of users.filter((user: User) => !user.bot)) {
                const member = this._task.message.guild?.member(user);
                if (member) {
                    switch (this._task.reactions.indexOf(name)) {
                        case 0:
                            this.onJoin(member);
                            break;
                        case 1:
                            this.onCancel(reaction, member);
                            break;
                        case 2:
                            this.onClose(member);
                            break;
                    }
                }
            }
        }
    }

}