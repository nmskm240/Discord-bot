import { Message } from "discord.js";

export interface IExecutedCallback {
    onCompleted(message: Message): void
}