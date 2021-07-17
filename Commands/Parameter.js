module.exports = class Parameter{
    constructor(name, detail, inputRule, canMultiSelect = false, canAbbreviation = false, abbreviationValue = ""){
        this.name = name;
        this.detail = detail;
        this.inputRule = inputRule;
        this.canMultiSelect = canMultiSelect;
        this.canAbbreviation = canAbbreviation;
        this.abbreviationValue = abbreviationValue;
    }
}