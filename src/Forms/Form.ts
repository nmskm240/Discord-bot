import { Client, CollectorFilter, GuildMember, MessageEmbed, MessageReaction, User } from "discord.js";
import { FormFactory } from ".";
import { FormTask, FormTaskData, FormTaskUpdate, Network, NoneResponse } from "../Networks";

export abstract class Form {
    protected _task: FormTask | null = null;
    protected _openTime: Date | null = null;
    protected  _filter: CollectorFilter | null = null;

    public abstract get isClose(): boolean
    public get timelimit(): number {
        return this._task ? this._task.endTime.getTime() - this._openTime!.getTime() : 0;
    }
    public get isTimeOut(): boolean {
        return this.timelimit <= 0;
    }

    public setTask(task: FormTask) {
        this._openTime = new Date();
        this._task = task;
        this._filter = (reaction: MessageReaction) => {
            return Object.values(task.reactions).includes(reaction.emoji.name);
        }
    }

    public static async reboot(client: Client): Promise<void> {
        const res = await Network.get<FormTaskData>(process.env.FORM_DB_API!);
        if (!res) {
            return;
        }
        const factroy = new FormFactory();
        for (const taskData of res.tasks) {
            const task = await FormTask.parse(client, taskData);
            const form = factroy.create(task.type);
            form.setTask(task);
            await form.reopen();
        }
    }

    protected abstract onRebooted(): Promise<void>
    protected abstract onReacted(reaction: MessageReaction, reactionMember: GuildMember): void
    protected abstract onUpdate(embed: MessageEmbed): void
    protected abstract onClose(embed: MessageEmbed): void

    private async reopen(): Promise<void> {
        await this.onRebooted();
        this.update();
        if (this.isClose) {
            this.close();
            return;
        }
        this.open(true);
    }

    private async save() {
        const query = new FormTaskUpdate("append");
        await Network.post<FormTask, NoneResponse>(process.env.FORM_DB_API!, this._task!, query);
        for (const reaction of Object.values<string>(this._task!.reactions)) {
            await this._task!.message.react(reaction);
        }
    }

    public async open(isReboot: boolean = false): Promise<void> {
        if(!this._task) {
            throw new Error("No task is set.");
        }
        if(!isReboot) {
            this.save();
        }
        const collector = this._task.message.createReactionCollector(
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

    public update() {
        const embed = Object.assign({}, this._task!.message.embeds[0]);
        this.onUpdate(embed);
        this._task!.message.edit(new MessageEmbed(embed));
    }

    public close() {
        const embed = Object.assign({}, this._task!.message.embeds[0]);
        this.onClose(embed);
        this._task!.message.edit(new MessageEmbed(embed));
        const query = new FormTaskUpdate("delete");
        Network.post<FormTask, NoneResponse>(process.env.FORM_DB_API!, this._task!, query);
    }
}