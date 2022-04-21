import { Command, Ping, Teaming, Who } from "."

export const CommandList: Command[] = [
    new Ping(),
    new Teaming(),
    new Who()
]