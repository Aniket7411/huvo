import axios from "axios";
import { RefreshAccessToken, getAccessToken } from "../user";

const Axios = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

Axios.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token ? token : ""}`,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && error.response.data.message === 'Token expired') {
      await RefreshAccessToken();
      const token = getAccessToken();
      originalRequest.headers.authorization = `Bearer ${token}`;
      return Axios(originalRequest);
    } else if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 400 )) {
      return Promise.reject(error);
    }
  }
);

export class HttpClient {
  static async get(url, params) {
    const response = await Axios.get(url, { params });
    return response?.data;
  }
  static async post(url, data,options ) {
   // console.log(data,"...........")

    const response = await Axios.post(url, data,options);
    console.log("Response from Axios:", response);
    return response?.data;
  }

  static async put(url, data) {
    
    const response = await Axios.put(url, data);
    return response?.data;
  }

  static async patch(url, data) {
    const response = await Axios.patch(url, data);
    return response?.data;
  }

  static async delete(url) {
    const response = await Axios.delete(url);
    return response?.data;
  }
}
