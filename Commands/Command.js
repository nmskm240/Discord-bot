module.exports = class Command {
    constructor(name, detail,　...parameters) {
        this.name = name;
        this.detail = detail;
        this.parameters = parameters;
        this.grammar = ".nit " + this.name + " " + this.parameters.map(p => p.name).join(" ");
    }

    execute(message, parameters) {

    }
}