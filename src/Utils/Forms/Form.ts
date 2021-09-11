import discord, { CollectorFilter, Message, MessageReaction, ReactionCollector, User } from "discord.js";
import { Team } from "..";
import { FormTask } from "./FormTask";
import { FormTaskDatabase } from "./FormTaskDatabase";

export class Form {
    private _task: FormTask;
    private _respondents: Team;

    constructor(task: FormTask) {
        this._task = task;
        this._respondents = new Team("回答者", task.answerable);
    }

    public static async reboot() {
        const res = await FormTaskDatabase.instance.all();
        for (const task of res) {
            const form = new Form(task);
            form.open(task.message!, true);
        }
    }

    public async open(message: Message, isOpened: boolean = false) {
        for (const reaction of Object.values<string>(this._task.reactions)) {
            await message.react(reaction);
        }
        const now: number = Date.now();
        if (!isOpened) {
            FormTaskDatabase.instance.insert(this._task);
        }
        else {
            const allows = message.reactions.cache.get(this._task.reactions.allow);
            if (!allows) {
                throw new Error("Couldn't find reactions");
            }
            const users: User[] = (allows.users.cache
                ?? await allows.users.fetch()).array();
            for (const user of users.filter((user: User) => !user.bot)) {
                const member = message.guild?.member(user);
                if (member) {
                    this._respondents.add(member);
                }
            }
            this.update(message);
            if (this._task.endTime.getTime() <= now) {
                this.close(message);
                return;
            }
        }
        const reactionFilter: CollectorFilter = (reaction: any) =>
            Object.values(this._task.reactions).includes(reaction.emoji.name);
        const collector: ReactionCollector = message
            .createReactionCollector(reactionFilter, {
                time: this._task.endTime.getTime() - now
            });
        collector.on("collect", (reaction: MessageReaction, user: User) => {
            const member = message.guild?.member(user);
            if (!member) {
                return;
            }
            if (reaction.emoji.name === this._task.reactions.allow) {
                this._respondents.add(member);
                if (this._respondents.isMax) {
                    this.update(message);
                    collector.stop();
                    return;
                }
            }
            else if (reaction.emoji.name === this._task.reactions.cancel) {
                this._respondents.remove(member);
                const userReactions = reaction.message.reactions.cache.filter((reaction: any) => reaction.users.cache.has(user.id) &&
                    (reaction.emoji.name === this._task.reactions.allow ||
                        reaction.emoji.name === this._task.reactions.cancel));
                try {
                    for (const reaction of userReactions.values()) {
                        reaction.users.remove(user.id);
                    }
                } catch (error) {
                    console.error('Failed to remove reactions.');
                }
            }
            else {
                if (user.id == this._task.creator.id) {
                    console.log("[Form]" + message.id + "は" + user.tag + "によって閉じられました");
                    collector.stop();
                    return;
                }
            }
            this.update(message);
        });
        collector.on("end", (collection: any) => {
            this.close(message);
        });
    }

    update(message: any) {
        const embed = Object.assign({}, message.embeds[0]);
        const field = embed.fields[0];
        field.value = this._respondents.isEmpty ? "なし" : this._respondents.members;
        embed.fields[0] = field;
        message.edit(new discord.MessageEmbed(embed));
    }

    close(message: any) {
        const embed = Object.assign({}, message.embeds[0]);
        embed.title = "募集終了";
        embed.color = "#000000";
        message.edit(new discord.MessageEmbed(embed));
        FormTaskDatabase.instance.remove({ message: this._task.message.id })
    }
}