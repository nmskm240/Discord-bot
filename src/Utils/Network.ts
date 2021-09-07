import axiosBase from "axios";
const baseURL = "https://script.google.com";

export class Network {
    public static URL: string | undefined;

    static async get(query: any) {
        const axios = axiosBase.create({
            baseURL: baseURL,
        });
        const res = await axios.get((Network as any).URL, {
            params: query,
        })
            .catch((error: any) => {
                console.log("GASへのGETに失敗");
                return error.response;
            });
        if (res.status != 200) {
            return null;
        }
        return res;
    }

    static async post(sendData: any) {
        const axios = axiosBase.create({
            baseURL: baseURL,
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            responseType: "json",
        });
        const res = await axios.post((Network as any).URL, sendData)
            .catch((error: any) => {
                console.log("GASへのPOSTに失敗");
                return error.response;
            });
        if (res.status != 200) {
            return null;
        }

    }
}