    import api from "./axios";
    import {ProfessionType} from "@/types/ProfessionType";

    export type ProfessionPayload = {
        id?: number;
        name: string;
    };
    export type AddProfessionResponse = {
        name: string;
    };

    export type ErrorResponse = {
        error: string;
    }


    export async function addProfession(
        data: ProfessionPayload,
    ): Promise<AddProfessionResponse | ErrorResponse> {
        const response = await api.post<AddProfessionResponse>("/profession", data);
        return response.data;
    }

    export async function editProfession(
        data: ProfessionPayload,
    ): Promise<AddProfessionResponse | ErrorResponse> {
        const response = await api.post<AddProfessionResponse>("/profession", data);
        console.log(response);
        return response.data;
    }

    export async function getProfessions(): Promise<ProfessionType[]> {
        const response = await api.get<ProfessionType[]>("/profession");
        return response.data;
    }

    export async function getProfession(id: number): Promise<ProfessionType> {
        const response = await api.get<ProfessionType>(`/profession/${id}`);
        return response.data;
    }

    export async function deleteProfession(
        id: number,
    ): Promise<AddProfessionResponse | ErrorResponse> {
        const response = await api.delete<AddProfessionResponse>(`/profession/${id}`);
        return response.data;
    }
