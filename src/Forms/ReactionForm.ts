import { CollectorFilter, MessageReaction, GuildMember, User } from "discord.js";
import { Form } from ".";
import { FormTask } from "../Networks";

export abstract class ReactionForm extends Form {
    protected _filter: CollectorFilter | null = null;
    protected _openTime: Date | null = null;

    public get timelimit(): number {
        return this._task ? this._task.endTime.getTime() - this._openTime!.getTime() : 0;
    }
    public get isTimeOut(): boolean {
        return this.timelimit <= 0;
    }

    protected abstract onReacted(reaction: MessageReaction, reactionMember: GuildMember): void

    public setTask(task: FormTask): void {
        super.setTask(task);
        this._openTime = new Date();
        this._filter = (reaction: MessageReaction) => {
            return Object.values(task.reactions).includes(reaction.emoji.name);
        }
    }

    public async open(isReboot?: boolean): Promise<void> {
        super.open(isReboot);
        const collector = this._task!.message.createReactionCollector(
            this._filter!,
            { time: this.timelimit }
        );
        collector.on("collect", (reaction: MessageReaction, user: User) => {
            const member: GuildMember | null | undefined = this._task!.guild.member(user);
            if (!member || user.bot) {
                return;
            }
            this.onReacted(reaction, member);
            this.update();
            if (this.isClose) {
                collector.stop();
            }
        });
        collector.on("end", (collection: any) => {
            this.close();
        });
    }
}