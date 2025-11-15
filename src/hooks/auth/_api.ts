import Axios from '@/lib/Axios';
import type { ApiResponse } from '@/types/common.api';

type ApiRequest = {
    email: string,
    password: string
}

type signinResponse = {
    user: any
}
/**
 * Creates a new account.
 * @returns {Promise<Object>} Response data from the server.
 */
export const signin = async (data: ApiRequest): Promise<ApiResponse<signinResponse>> => {
    const response = await Axios.post<ApiResponse<signinResponse>>('/auth/signin', data);
    return response.data;
};

export const signout = async (): Promise<ApiResponse<any>> => {
    const response = await Axios.post<ApiResponse<any>>('/auth/signout');
    return response.data;
};

export const getCurrentUser = async (): Promise<ApiResponse<any>> => {
    const response = await Axios.get<ApiResponse<any>>('/auth/me');
    return response.data;
};