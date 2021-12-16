import { Command, Help, RandomTeamChat, RandomTeamVoice, Recruit, Who } from ".";
import { IFactory } from "../Utils";

export class CommandFactory implements IFactory<Command | null> {
    public create(arg: string): Command | null {
        switch(arg) {
            case "help":
                return new Help();
            case "rtc":
                return new RandomTeamChat();
            case "rtv":
                return new RandomTeamVoice();
            case "recruit":
                return new Recruit();
            case "who":
                return new Who();
            default:
                return null;
        }
    }
}