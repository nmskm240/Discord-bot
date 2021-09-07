import { Message, MessageEmbed } from "discord.js";
import { Command } from "./Command";
import { Form } from "../Utils";
import { FreeWriteParameter, OmittableNumberParameter } from "./Parameters/";

export class Recruit extends Command {
    private _form: Form = new Form();

    reactions: any;
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
        this.reactions = {
            allow: "✅",
            cancel: "❎",
            close: "✖",
        };
    }

    public async execute(): Promise<MessageEmbed> {
        return this._form.create("募集中", this.parameters[0].valueOrDefault, "参加者", this.info.message!.author);
        // .then((m: any) => m.react(this.reactions.allow))
        // .then((mReaction: any) => mReaction.message.react(this.reactions.cancel))
        // .then((mReaction: any) => mReaction.message.react(this.reactions.close))
        // .then((mReaction: any) => form.open(mReaction.message, this.reactions, parameter.time.term));
    }

    public async onComplite(message: Message): Promise<void> {
        for(const reaction of this.reactions.values) {
            await message.react(reaction);
        }
        
    }
}