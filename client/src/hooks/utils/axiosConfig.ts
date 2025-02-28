import axios from "axios";
import { useSession } from 'next-auth/react';

export default function configAxios() {

  axios.defaults.headers.common["Accept"] = "application/json";
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  axios.defaults.headers.common["Access-Control-Allow-Methods"] =
    "GET,PUT,POST,DELETE,PATCH,OPTIONS";
  // axios.defaults.withCredentials = true

  axios.interceptors.request.use(

    async (config) => {
      const { data: session } = useSession();
      if (session != undefined) {
        config.headers["Authorization"] = session.user?.email;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.StatusCode === 400 &&
        (error.response.data.StatusText === "Token expired." ||
          error.response.data.StatusText === "Bad token." ||
          error.response.data.StatusText === "Bearer Token missing.")
      ) {
        window.location.href = `/?expired=true`;
      }

      return Promise.reject(error);
    }
  );
}
