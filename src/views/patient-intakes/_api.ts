import Axios from '@/lib/Axios';
import type { ApiResponse } from '@/types/common.api';

export interface AccountInfo {
    createdAt: string;                 // ISO date string
    updatedAt: string;                 // ISO date string
    accountHolderName: string;
    accountHolderEmail: string;
    medicalDirectorName: string;
    medicalDirectorLicense: string;
    medicalDirectorEmail: string;
    authStatus: "Pending" | "Approved" | "Rejected";
}

export type PaginationInfo = {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
};

export type IntakeSummary = {
    totalIntakes: number;
    completed: number;
    authPending: number;
};


type Response = {
    accounts: AccountInfo[]
    statistics: IntakeSummary
    pagination: PaginationInfo
}

export type PreferredLocationType = "all" | 'leaside' | "downtown"
export type AuthStatusType = "all" | 'pending' | "completed"

export type QueryParams = {
    preferredLocation: PreferredLocationType,
    authStatus: AuthStatusType
}

/**
 * Creates a new account.
 * @returns {Promise<Object>} Response data from the server.
 */
export const getAllPatient = async (params: QueryParams): Promise<ApiResponse<Response>> => {
    const response = await Axios.get<ApiResponse<Response>>('/patient', { params });
    return response.data;
};
