import { Message, MessageEmbed } from "discord.js";
import { Command } from "./Command";
import { Form, FormTask, FormType } from "../Utils";
import { FreeWriteParameter } from "./Parameters";
import { IExecutedCallback } from ".";

export class Recruit extends Command implements IExecutedCallback {
    private _reactions: any = {
        allow: "✅",
        cancel: "❎",
        close: "✖",
    }
    private _limit: Date | null = null;

    constructor() {
        super(
            "recruit",
            "リアクションを使用した募集フォームを作成します。\n",
            [
                new FreeWriteParameter("募集内容", "募集する内容について自由に入力できます。"),
            ]
        );
    }

    public async execute(): Promise<MessageEmbed> {
        this._limit = new Date(this.info.timestamp!);
        this._limit.setHours(this._limit.getHours() + 24);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        };
        return new MessageEmbed()
            .setTitle("募集中")
            .setDescription(this.parameters[0].valueOrDefault + "\n\n" +
                this._reactions.allow + "：参加 " + this._reactions.cancel + "：参加取消\n" +
                "募集終了：" + this._limit.toLocaleString('jp', options))
            .setColor("#00a2ff")
            .addField("参加者", "なし")
    }

    public onCompleted(message: Message): void {
        Form.create(
            new FormTask(
                FormType.Recruit,
                this.info.guild!,
                this.info.channel!,
                message,
                this.info.performer!,
                this._limit!,
                [
                    this._reactions.allow,
                    this._reactions.cancel,
                    this._reactions.close,
                ]
            )
        ).open();
    }
}
