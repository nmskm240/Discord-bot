import { Message, MessageEmbed } from "discord.js";
import { Command } from "./Command";
import { Form } from "../Utils";
import { FreeWriteParameter, OmittableNumberParameter } from "./Parameters";
import { FormTask } from "../Utils/FormTask";

export class Recruit extends Command {
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
                new OmittableNumberParameter("募集人数", "募集する人数を指定します。", (value: number): boolean => { return value > 0; }, -1),
                new OmittableNumberParameter("募集期間", "募集を終了するまでの時間を指定します。", (value: number): boolean => { return value > 0; }, 24),
            ]
        );
    }

    public async execute(): Promise<MessageEmbed> {
        this._limit = new Date(this.info.timestamp!);
        this._limit.setHours(this._limit.getHours() + 24);
        return new MessageEmbed()
            .setTitle("募集中")
            .setDescription(this.parameters[0].valueOrDefault + "\n\n" +
                this._reactions.allow + "：参加 " + this._reactions.cancel + "：参加取消\n" +
                "募集人数：" + this._parameters[1].valueOrDefault + "\n" +
                "募集終了：" + this._limit.toString())
            .setColor("#00a2ff")
            .addField("参加者", "なし")
    }

    public async onComplite(message: Message): Promise<void> {
        new Form(
            new FormTask(this.info.guild!, this.info.channel!, message, this.info.performer!, this._limit!, this.parameters[1].valueOrDefault, this._reactions)
        ).open(message);
    }
}