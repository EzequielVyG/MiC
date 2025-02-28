import axios from "axios";
import { URL } from '../../constants';

const restorePassword = async (aEmail: string, aNewPassword: string, aPasswordToken: any) => {
    return await axios
        .post(`${URL}/users/resetPassword`, { email: aEmail, password: aNewPassword, token: aPasswordToken })
        .then((response) => {
            return response.data;
        })
        .catch((error: any) => {
            console.log(error);
            throw error;
            if (error.response.data.StatusCode === 500) return error.response.data;
        });
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    restorePassword
}