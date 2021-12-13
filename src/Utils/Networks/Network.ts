import axiosBase, { AxiosInstance, AxiosResponse } from "axios";
import { AccessPoint } from "..";
import { DTO } from "./Models/DTO";
import { IQuery } from "./Models/IQuery";

export class Network {
    public static async get<Response extends DTO>(accessPoint: AccessPoint, query: IQuery | undefined = undefined): Promise<Response | null> {
        if (!accessPoint) {
            return null;
        }
        const axios: AxiosInstance = axiosBase.create();
        const res: AxiosResponse<Response> = await axios.get<Response>(accessPoint, {
            params: query?.toObject(),
        });
        if (res.status != 200) {
            return null;
        }
        return res.data;
    }

    public static async post<Request extends DTO, Response extends DTO>(accessPoint: AccessPoint, data: Request, query: IQuery | undefined = undefined): Promise<Response | null> {
        if (!accessPoint) {
            return null;
        }
        const axios = axiosBase.create({
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            responseType: "json",
        });
        const res: AxiosResponse<Response> = await axios.post<Request, Response>(accessPoint, data, {
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