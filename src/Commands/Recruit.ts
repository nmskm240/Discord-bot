import { Message, MessageEmbed } from "discord.js";
import { Command } from "./Command";
import { FreeWriteParameter } from "./Parameters";
import { IExecutedCallback } from ".";
import { Form, FormType, RecruitForm } from "../Forms";
import { FormTask } from "../Networks";

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

    public async execute(): Promise<void> {
        this._limit = new Date(this.info.timestamp!);
        this._limit.setDate(this._limit.getDate() + 1);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        };
        this._result = new MessageEmbed()
            .setTitle("募集中")
            .setDescription(this.parameters[0].valueOrDefault + "\n\n" +
                this._reactions.allow + "：参加 " + this._reactions.cancel + "：参加取消\n" +
                "募集終了：" + this._limit.toLocaleString('jp', options))
            .setColor("BLUE")
            .addField("参加者", "なし")
    }

    public onCompleted(message: Message): void {
        const task = new FormTask(
            FormType.RECRUIT,
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
        );
        const form = new RecruitForm();
        form.setTask(task);
        form.open();
    }
}
