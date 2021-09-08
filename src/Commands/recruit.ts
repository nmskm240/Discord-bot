import { Message, MessageEmbed } from "discord.js";
import { Command } from "./Command";
import { Form } from "../Utils";
import { FreeWriteParameter, OmittableNumberParameter } from "./Parameters";

export class Recruit extends Command {
    private _form: Form = new Form();

    reactions: any = {
        allow: "✅",
        cancel: "❎",
        close: "✖",
    };
    term: any = {
        date: 1,
        hour: 0,  
    };

    constructor() {
        super(
            "recruit",
            "リアクションを使用した募集フォームを作成します。\n",
            [
                new FreeWriteParameter("募集内容", "募集する内容について自由に入力できます。"),
                new OmittableNumberParameter("募集人数", "募集する人数を指定します。", (value: number): boolean => { return 0 < value; }, -1),
                // new Parameter("募集期間", "募集を終了するまでの日時を指定します。", "XdYh(X,Yは0以上の整数)", false, true, "1d")
            ]
        );
    }

    public async execute(): Promise<MessageEmbed> {
        const now: Date = new Date();
        const limit: string = 0 < this.parameters[1].valueOrDefault ? this.parameters[1].valueOrDefault.toString() : "制限なし";
        now.setDate(now.getDate() + 1);
        const body:string = this.parameters[0].valueOrDefault + "\n\n" +
            this.reactions.allow + "：参加 " + this.reactions.cancel + "：参加取消\n" + 
            "募集人数：" + limit + "\n" + 
            "募集終了：" + now.toString(); 
        return this._form.create("募集中", body, "参加者", this.info.message!.author);
    }

    public async onComplite(message: Message): Promise<void> {
        for (const reaction of Object.values<string>(this.reactions)) {
            await message.react(reaction);
        }
        this._form.open(message, this.reactions, this.term);
    }
}