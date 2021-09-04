export class Command {
    detail: any;
    grammar: any;
    name: any;
    parameters: any;
    constructor(name: any, detail: any,　...parameters: any[]) {
        this.name = name;
        this.detail = detail;
        this.parameters = parameters;
        this.grammar = ".nit " + this.name + " " + this.parameters.map((p: any) => p.name).join(" ");
    }

    execute(message: any, parameters: any) {

    }
}