import discord from "discord.js";
import { Network } from "./Network";
import { Team } from "./Team";

export class Form {
    creator: any;
    respondents: any;
    constructor(answerableSize = -1) {
        this.respondents = new Team("回答者", answerableSize);
    }

    static reboot(client: any) {
        Network.get({ command: "recruit" })
            .then((res: any) => {
                if (res.data[0].id) {
                    console.log("[Form]" + res.data.length + "個のFormを再起動");
                    res.data.forEach((task: any) => {
                        const now = new Date();
                        const end = new Date(task.endTime);
                        const reactions = task.reactions;
                        const term = {
                            date: end.getDate() - now.getDate(),
                            hour: end.getHours() - now.getHours(),
                        }
                        const guild = client.guilds.cache.get(task.id.guild);
                        const channel = guild.channels.cache.get(task.id.channel);
                        channel.messages.fetch(task.id.message)
                            .then((message: any) => {
                                channel.messages.fetch(task.id.creatorMessage)
                                    .then((cmessage: any) => {
                                        const creator = cmessage.author;
                                        const form = new Form(task.id.answerable);
                                        form.creator = creator;
                                        form.open(message, reactions, term, true);
                                    })
                            });
                    });
                }
            })
    }

    create(title: any, body: any, fieldName: any, creator: any) {
        this.creator = creator;
        const embed = new discord.MessageEmbed()
            .setTitle(title)
            .setDescription(body)
            .setColor("#00a2ff")
            .addField(fieldName, "なし")
        return embed;
    }

    open(message: any, reactions: any, term: any, isOpened = false) {
        if (!isOpened) {
            console.log("[Form]" + this.creator.tag + "によって新しいForm(" + message.id + ")が開かれました");
            const limit = new Date();
            limit.setDate(limit.getDate() + term.date);
            limit.setHours(limit.getHours() + term.hour);
            const postData = {
                command: "recruit",
                method: "append",
                data: {
                    id: {
                        guild: message.guild.id,
                        channel: message.channel.id,
                        message: message.id,
                        creatorMessage: this.creator.lastMessage.id,
                    },
                    reactions: reactions,
                    endTime: limit,
                    answerable: this.respondents.max,
                }
            }
            Network.post(postData);
        }
        else {
            message.reactions.cache.get(reactions.allow).users.fetch()
                .then((users: any) => {
                    this.respondents.addMembers(users.filter((user: any) => !user.bot).array());
                    this.update(message);
                    console.log("[Form]" + message.id + "の再起動が完了しました");
                });
            if (term.hour <= 0) {
                if (term.date <= 0) {
                    this.close(message);
                    return;
                }
                term.date--;
                term.hour += 24;
            }
        }
        const reactionFilter = (reaction: any, user: any) =>
            reaction.emoji.name === reactions.allow ||
            reaction.emoji.name === reactions.cancel ||
            reaction.emoji.name === reactions.close;
        const collector = message
            .createReactionCollector(reactionFilter, {
                time: (term.date * 24 * 60 * 60 * 1000) +
                    (term.hour * 60 * 60 * 1000)
            });
        collector.on("collect", (reaction: any, user: any) => {
            if (reaction.emoji.name === reactions.allow) {
                console.log("[Form]" + user.tag + "が" + message.id + "に参加しました");
                this.respondents.addMember(user);
                if (this.respondents.isMax) {
                    this.update(message);
                    collector.stop();
                    console.log("[Form]" + message.id + "は人数上限により閉じられました");
                    return;
                }
            }
            else if (reaction.emoji.name === reactions.cancel) {
                console.log("[Form]" + user.tag + "が" + message.id + "への参加を取消しました");
                this.respondents.removeMember(user);
                const userReactions = reaction.message.reactions.cache.filter((reaction: any) => reaction.users.cache.has(user.id) &&
                (reaction.emoji.name === reactions.allow ||
                    reaction.emoji.name === reactions.cancel));
                try {
                    for (const reaction of userReactions.values()) {
                        reaction.users.remove(user.id);
                    }
                } catch (error) {
                    console.error('Failed to remove reactions.');
                }
            }
            else {
                if (user.id == this.creator.id) {
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
        field.value = this.respondents.isEmpty ? "なし" : this.respondents.members;
        embed.fields[0] = field;
        message.edit(new discord.MessageEmbed(embed));
    }

    close(message: any) {
        const embed = Object.assign({}, message.embeds[0]);
        embed.title = "募集終了";
        embed.color = "#000000";
        message.edit(new discord.MessageEmbed(embed));
        const postData = {
            command: "recruit",
            method: "delete",
            data: {
                messageID: message.id,
            }
        };
        Network.post(postData);
    }
}