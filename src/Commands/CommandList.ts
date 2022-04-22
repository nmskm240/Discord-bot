import { Command, Help, Teaming, Who } from "."

export const CommandList: Command[] = [
    new Help(),
    new Teaming(),
    new Who()
]