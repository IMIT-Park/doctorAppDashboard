import axios from "axios";

// google map api key
export const googleMapsApiKey = "AIzaSyBLY08Xu8vf1iZPDBk86jNKbl8THKwXG1A";

export const baseUrl = "https://doctorbackend.gitdr.com/api";

export const imageBaseUrl = "https://doctorbackend.gitdr.com/";

// export const imageBaseUrl = "https://doctorbackend.gitdr.com/";

// dashboard url
export const dashboardUrl = "https://mydoctorsdashboard.gitdr.com/";

// website url
export const websiteUrl = "http://localhost:3000/";

// Helper function to get stored token details
function getStoredTokenDetails() {
  const accessToken = sessionStorage.getItem("accessToken");
  const refreshToken = sessionStorage.getItem("refreshToken");
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

class NetworkHandler {
  #axios = axios.create({
    baseURL: baseUrl,
  });

  constructor() {
    this.#axios.interceptors.request.use(
      (config) => {
        config.headers["Content-Type"] = "Application/json";
        const tokenDetails = getStoredTokenDetails();
        if (tokenDetails?.accessToken) {
          config.headers.Authorization = `Bearer ${tokenDetails.accessToken}`;
        }

        config.headers["ngrok-skip-browser-warning"] = "true";

        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    this.#axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (
          error.response?.status === 401 &&
          error.response?.data?.message == "Invalid access token." &&
          getStoredTokenDetails()
        ) {
          const { refreshToken } = getStoredTokenDetails();
          try {
            const response = await this.#axios.post("/v1/auth/refreshToken", {
              RefreshToken: refreshToken,
            });
            const { accessToken } = response.data;
            sessionStorage.setItem("accessToken", accessToken);

            const config = error.config;
            config.headers.Authorization = `Bearer ${accessToken}`;
            return this.#axios(config);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * @returns {Boolean} true if user is logged in
   */
  hasAccessToken() {
    return getStoredTokenDetails() != null;
  }

  storeAccessTokenInfo(accessToken, refreshToken) {
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);
  }

  makeGetRequest(url, headers) {
    return this.#axios.get(url, { headers });
  }

  makePostRequest(url, body, headers) {
    return this.#axios.post(url, body, { headers });
  }

  makePutRequest(url, body, headers) {
    return this.#axios.put(url, body, { headers });
  }

  makeDeleteRequest(url, headers) {
    return this.#axios.delete(url, { headers });
  }
}

export default new NetworkHandler();
