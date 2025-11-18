import Axios from '@/lib/Axios';
import type { ApiResponse } from '@/types/common.api';
import type { PatientIntakesResponse, PatientResponse, QueryParams } from './types';


/**
 * Fetches all patients from the server.
 * @param params Query parameters for filtering or pagination.
 * @returns {Promise<ApiResponse<PatientIntakesResponse>>} Response data from the server.
 */
export const getAllPatient = async (params: QueryParams): Promise<ApiResponse<PatientIntakesResponse>> => {
    const response = await Axios.get<ApiResponse<PatientIntakesResponse>>('/patient', { params });
    return response.data;
};

/**
 * Fetches all patients from the server.
 * @param params Query parameters for filtering or pagination.
 * @returns {Promise<ApiResponse<Response>>} Response data from the server.
 */
export const getPatient = async ({ accountId }: { accountId: number }): Promise<ApiResponse<PatientResponse>> => {
    const response = await Axios.get<ApiResponse<PatientResponse>>(`/patient/${accountId}`);
    return response.data;
};

/**
 * Resends the authentication email for a patient account.
 * @param data Object containing the account ID.
 * @param data.accountId The ID of the account to resend the email for.
 * @returns {Promise<ApiResponse<Response>>} Response data from the server.
 */
export const resendAuthEmail = async (data: { accountId: number }): Promise<ApiResponse<Response>> => {
    const response = await Axios.post<ApiResponse<Response>>('/patient/resend-auth-email', data);
    return response.data;
};