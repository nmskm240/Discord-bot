module.exports = class Parameter{
    constructor(name, detail, inputRule = "", canMultiSelect = false, canAbbreviation = false, abbreviationValue = ""){
        this.name = name;
        this.detail = detail + "\n";
        this.inputRule = inputRule;
        this.canMultiSelect = canMultiSelect;
        this.canAbbreviation = canAbbreviation;
        this.abbreviationValue = abbreviationValue;
        if(canMultiSelect){
            this.detail += "この引数は__複数指定可能__です。\n";
        }
        if(canAbbreviation){
            this.detail += "この引数は__省略可能__です。\n";
            this.detail += "省略した場合、この引数に**" + abbreviationValue + "**が入力されたものとして扱います。\n";
        }
        if(inputRule){
            this.detail += "この引数は**" + inputRule + "**で入力してください。\n"
        }
    }
}