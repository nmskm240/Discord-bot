const axiosBase = require("axios");
const baseURL = "https://script.google.com";

module.exports = class Network {
    static async get(query) {
        const axios = axiosBase.create({
            baseURL: baseURL,
        });
        const res = await axios.get("/macros/s/AKfycbzIR3Pyzlpc8sfBQ1B6a8v5SOA1Y2GjEijwzZttIZTyQSJYnD5P8V9DHcLFPU_0YBAF/exec", {
            params: query,
        })
            .catch(error => {
                console.log("GASへのGETに失敗");
                return error.response;
            });
        if (res.status != 200) {
            return null;
        }
        return res;
    }

    static async post(sendData) {
        const axios = axiosBase.create({
            baseURL: baseURL,
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            responseType: "json",
        });
        const res = await axios.post("/macros/s/AKfycbzIR3Pyzlpc8sfBQ1B6a8v5SOA1Y2GjEijwzZttIZTyQSJYnD5P8V9DHcLFPU_0YBAF/exec", sendData)
            .catch(error => {
                console.log("GASへのPOSTに失敗");
                return error.response;
            });
        if (res.status != 200) {
            return null;
        }

    }
}