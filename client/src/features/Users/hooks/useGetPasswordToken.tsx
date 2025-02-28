import axios from "axios";
import { URL } from '../../constants';

const getTokenData = async (aPasswordToken: string | string[] | undefined) => {
    return await axios
        .post(`${URL}/users/passwordToken/`, { token: aPasswordToken })
        .then((response) => {
            return response.data;
        })
        .catch((error: any) => {
            if (error.response.data.StatusCode === 500) return error.response.data;
        });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getTokenData,
}