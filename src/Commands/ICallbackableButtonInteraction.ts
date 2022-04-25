import { ButtonInteraction } from "discord.js";

export interface ICallbackableButtonInteraction {
    callback(interaction: ButtonInteraction): any
}