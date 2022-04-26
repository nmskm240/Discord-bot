import axiosBase, { AxiosInstance, AxiosResponse } from "axios";
import { IDto, IQuery } from ".";

export class Network {
    public static async get<Response extends IDto>(url: string, query: IQuery | undefined = undefined): Promise<Response | null> {
        const axios: AxiosInstance = axiosBase.create();
        const res: AxiosResponse<Response> = await axios.get<Response>(url, {
            params: query?.toObject(),
        });
        if (res.status != 200) {
            return null;
        }
        return res.data;
    }

    public static async post<Request extends IDto, Response extends IDto>(url: string, data: Request, query: IQuery | undefined = undefined): Promise<Response | null> {
        const axios = axiosBase.create({
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            responseType: "json",
        });
        const res: AxiosResponse<Response> = await axios.post<Request, Response>(url, data, {
            params: query?.toObject(),
        }).catch((error: any) => {
            console.log("GASへのPOSTに失敗");
            return error.response;
        });
        if (res.status != 200) {
            return null;
        }
        return res.data;
    }
}