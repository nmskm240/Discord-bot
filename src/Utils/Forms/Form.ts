import { Client, CollectorFilter, GuildMember, MessageEmbed, MessageReaction, User } from "discord.js";
import { FormTask, FormType, Network, NoneResponse, RecruitForm } from "..";
import { FormTaskUpdate } from "../Networks/Models/Query/FormTaskUpdate";
import { FormTaskData } from "../Networks/Models/Responses/FormTaskData";

export abstract class Form {
    protected _openTime: Date;
    protected _task: FormTask;
    protected _filter: CollectorFilter;
    protected _isClose: boolean = false;

    public get isClose(): boolean {
        return this._isClose || this._task.endTime.getTime() <= this._openTime.getTime();
    }

    constructor(task: FormTask) {
        this._openTime = new Date();
        this._task = task;
        this._filter = (reaction: MessageReaction) => {
            return Object.values(task.reactions).includes(reaction.emoji.name);
        }
    }

    public static async reboot(client: Client) {
        const res = await Network.get<FormTaskData>(process.env.FORM_DB_API!);
        if (!res) {
            return;
        }
        for (const task of res.tasks) {
            Form.create(await FormTask.parse(client, task)).open(true);
        }
    }

    public static create(task: FormTask): Form {
        switch (task.type) {
            case FormType.RECRUIT:
                return new RecruitForm(task);
            case FormType.ROOM:
                return new RecruitForm(task);
        }
    }

    protected abstract onRebooted(): Promise<void>
    protected abstract onReacted(reaction: MessageReaction, reactionMember: GuildMember): void
    protected abstract onUpdate(embed: MessageEmbed): void
    protected abstract onClosed(embed: MessageEmbed): void

    public async open(isOpened: boolean = false) {
        if (isOpened) {
            await this.onRebooted();
            this.update();
            if (this.isClose) {
                this.close();
                return;
            }
        }
        else {
            const query = new FormTaskUpdate("append");
            await Network.post<FormTask, NoneResponse>(process.env.FORM_DB_API!, this._task, query);
            for (const reaction of Object.values<string>(this._task.reactions)) {
                await this._task.message.react(reaction);
            }
        }
        const collector = this._task.message.createReactionCollector(
            this._filter!,
            { time: this._task.endTime.getTime() - this._openTime.getTime() }
        );
        collector.on("collect", (reaction: MessageReaction, user: User) => {
            const member: GuildMember | null | undefined = this._task.message.guild?.member(user);
            if (!member) {
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

    protected update() {
        const embed = Object.assign({}, this._task.message.embeds[0]);
        this.onUpdate(embed);
        this._task.message.edit(new MessageEmbed(embed));
    }

    protected close() {
        this._isClose = true;
        const embed = Object.assign({}, this._task.message.embeds[0]);
        this.onClosed(embed);
        this._task.message.edit(new MessageEmbed(embed));
        const query = new FormTaskUpdate("delete");
        Network.post<FormTask, NoneResponse>(process.env.FORM_DB_API!, this._task, query);
    }
}