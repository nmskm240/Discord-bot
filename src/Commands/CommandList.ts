import { Command, Help, RandomTeamChat, RandomTeamVoice, Recruit, Who } from ".";

export class CommandList {
    private static COMMANDS: Map<string, Command> = new Map();

    public static init(): void {
        if (0 == CommandList.COMMANDS.size) {
            CommandList.COMMANDS.set("help", new Help());
            CommandList.COMMANDS.set("rtc", new RandomTeamChat());
            CommandList.COMMANDS.set("rtv", new RandomTeamVoice());
            CommandList.COMMANDS.set("recruit", new Recruit());
            CommandList.COMMANDS.set("who", new Who());
        }
    }

    public static get(name: string): Command {
        const command: Command | undefined = CommandList.COMMANDS.get(name);
        if (command) {
            return command;
        } else {
            throw new Error("Unknown command");
        }
    }
}