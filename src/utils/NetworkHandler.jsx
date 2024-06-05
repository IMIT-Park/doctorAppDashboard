import axios from "axios";

export const baseUrl = "https://doctorbackend.gitdr.com/api";
export const imageBaseUrl = "https://doctorbackend.gitdr.com";

class NetworkHandler {
  #axios = axios.create({
    baseURL: baseUrl,
  });

  constructor() {
    this.#axios.interceptors.request.use(
      function (config) {
        const accessToken = sessionStorage.getItem("accessToken");
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    this.#axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }

  makeGetRequest(url, headers) {
    return this.#axios.get(url, {
      headers,
    });
  }

  makePostRequest(url, body, headers) {
    return this.#axios.post(url, body, {
      headers,
    });
  }

  makePutRequest(url, body, headers) {
    return this.#axios.put(url, body, {
      headers,
    });
  }

  makeDeleteRequest(url, headers) {
    return this.#axios.delete(url, {
      headers,
    });
  }
}

export default new NetworkHandler();
