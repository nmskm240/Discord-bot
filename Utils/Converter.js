module.exports = class Converter {
    static text2Time(text) {
        const data = {
            limit: new Date(),
            term: {
                date: 1,
                hour: 0,
            }
        }
        const dIndex = text.indexOf("d");
        const hIndex = text.indexOf("h");
        if (dIndex == -1 && hIndex == -1) {
            data.limit.setDate(data.limit.getDate() + 1);
        }
        else {
            console.log(dIndex + "," + hIndex);
            if (dIndex != -1) {
                let parsed = parseInt(text.substring(0, dIndex), 10);
                if (!isNaN(parsed) && 0 < parsed) {
                    data.limit.setDate(data.limit.getDate() + parsed);
                    data.term.date = parsed;
                }
            }
            if (hIndex != -1) {
                let parsed = parseInt(text.substring(dIndex, hIndex), 10);
                if (!isNaN(parsed) && 0 < parsed) {
                    data.limit.setHours(data.limit.getHours() + parsed);
                    data.term.hour = parsed;
                }
            }
        }
        data.limit.setHours(data.limit.getHours() + 9);
        return data;
    }
}