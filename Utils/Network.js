const axiosBase = require("axios");
const url = 

module.exports = class Network {
    static get(query){
        const axios = axiosBase.create({
            baseURL: "https://script.google.com",
        });
        const res = await axios.get("/macros/s/AKfycbzIR3Pyzlpc8sfBQ1B6a8v5SOA1Y2GjEijwzZttIZTyQSJYnD5P8V9DHcLFPU_0YBAF/exec", {
            params: query,
        })
        return res;
    }

    static post(sendData) {
        const axios = axiosBase.create({
            baseURL: "https://script.google.com",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            responseType: "json",
        });
        axios.post("/macros/s/AKfycbzIR3Pyzlpc8sfBQ1B6a8v5SOA1Y2GjEijwzZttIZTyQSJYnD5P8V9DHcLFPU_0YBAF/exec", sendData)
            .then(async function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log("ERROR!! occurred in Backend.");
                console.error(error);
            });
    }
}