import axios from "axios";
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // baseURL: "http://localhost:3000/v1",
  withCredentials: true,
});

// Add a request interceptor
api.interceptors.request.use(
  function (config) {
    Object.assign(config.headers, {
      ...config.headers,
      "Content-Type": "application/json",
    });

    return config;
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);

export default api;
