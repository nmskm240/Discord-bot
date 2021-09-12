import { CollectorFilter, GuildMember, MessageEmbed, MessageReaction, ReactionCollector, User } from "discord.js";
import { Team, FormTask, FormTaskDatabase, FormType, RecruitForm } from "..";

export abstract class Form {
    protected _openTime: Date;
    protected _task: FormTask;
    protected _respondents: Team;
    protected _filter: CollectorFilter;
    protected _collector: ReactionCollector | null = null;
    protected _isClose: boolean = false;

    public get isClose(): boolean { 
        return this._isClose || this._task.endTime.getTime() <= this._openTime.getTime(); 
    }

    constructor(task: FormTask) {
        this._openTime = new Date();
        this._task = task;
        this._respondents = new Team("", task.answerable);
        this._filter = (reaction: MessageReaction) => {
            return Object.values(task.reactions).includes(reaction.emoji.name);
        }
        this._collector = null;
    }

    public static async reboot() {
        const res = await FormTaskDatabase.instance.all();
        for (const task of res) {
            Form.create(task).open(true);
        }
    }

    public static create(task: FormTask): Form {
        switch(task.type) {
            case FormType.Recruit:
                return new RecruitForm(task);
        }
    }

    protected abstract onRebooted(): Promise<void>
    protected abstract onReacted(reaction: MessageReaction, reactionMember: GuildMember): void

    public async open(isOpened: boolean = false) {
        if (!isOpened) {
            for (const reaction of Object.values<string>(this._task.reactions)) {
                await this._task.message.react(reaction);
            }
            FormTaskDatabase.instance.insert(this._task!);
        }
        else {
            await this.onRebooted();
            this.update();
            if (this.isClose) {
                this.close();
                return;
            }
        }
        this._collector = this._task.message.createReactionCollector(
            this._filter!,
            { time: this._task.endTime.getTime() - this._openTime.getTime() }
        );
        this._collector.on("collect", (reaction: MessageReaction, user: User) => {
            const member: GuildMember | null | undefined = this._task.message.guild?.member(user);
            if (!member) {
                return;
            }
            this.onReacted(reaction, member);
            this.update();
            if (this.isClose) {
                this.close();
                return;
            }
        });
        this._collector.on("end", (collection: any) => {
            this.close();
        });
    }

    protected update() {
        const embed = Object.assign({}, this._task.message.embeds[0]);
        const field = embed.fields[0];
        field.value = this._respondents.isEmpty ? "なし" : this._respondents.members.toString();
        embed.fields[0] = field;
        this._task.message.edit(new MessageEmbed(embed));
    }

    protected close() {
        this._isClose = true;
        const embed = Object.assign({}, this._task.message.embeds[0]);
        embed.title = "募集終了";
        embed.color = 0;
        this._task.message.edit(new MessageEmbed(embed));
        FormTaskDatabase.instance.remove({ message: this._task.message.id })
    }
}