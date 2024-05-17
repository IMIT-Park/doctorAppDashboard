import axios from "axios";

function getAccessTokenDetails() {
  const storedTokenData = sessionStorage.getItem("accessToken");
  const { accessToken, RefreshToken } = JSON.parse(storedTokenData);
  return { accessToken, RefreshToken };
}

export const baseUrl = "https://mds.gitdr.com/api";
export const imageBaseUrl = "https://mds.gitdr.com/";

class NetworkHandler {
  #axios = axios.create({
    baseURL: baseUrl,
  });

  constructor() {
    this.#axios.interceptors.request.use(
      function (config) {
        if (getAccessTokenDetails().accessToken)
          config.headers.Authorization = `Bearer ${
            getAccessTokenDetails().accessToken
          }`;
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
      async (error) => {
        if (error?.response?.status == 401) {
          const requestBody = {
            refreshToken: getAccessTokenDetails().RefreshToken,
          };
          const response = await this.makePostRequest(
            "refreshToken",
            requestBody
          );
          const accessTokenDetails = getAccessTokenDetails();
          accessTokenDetails.accessToken = response.data.accessToken;
          sessionStorage.setItem(
            "accessToken",
            JSON.stringify(accessTokenDetails)
          );
          return new Promise((resolve) => {
            const config = error.config;
            config.headers.Authorization = `Bearer ${accessTokenDetails.accessToken}`;
            resolve(this.#axios(config));
          });
        }
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
