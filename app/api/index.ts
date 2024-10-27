import axios from "axios";
import { getSession } from "~/services/session.server";

export type LoginPayload = {
  identity: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
};

const Api = class Api {
  baseURL: string;
  token: string | undefined;
  constructor() {
    this.baseURL = process.env.API_BASE_URL as string;
    this.token = "";
  }

  initializeInstance = () => {
    const baseURL = this.baseURL;
    console.log(baseURL);

    const instance = axios.create({
      baseURL,
      withCredentials: false,
    });

    instance.interceptors.request.use(
      (config: any) => {
        return config;
      },
      (error: any) => {
        console.log(error);

        return Promise.reject(error);
      }
    );

    return instance;
  };

  publicRequest = (url: string, method: string, data: any) => {
    const instance = this.initializeInstance();
    return instance({
      url,
      method,
      data,
    });
  };

  loginUser = (payload: LoginPayload) => {
    const url = "/users/auth-with-password";
    return this.publicRequest(url, "POST", payload);
  };

  async setToken(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("credentials")?.token;
    this.token = token;
  }
  authClient = (url: string, method: string, data: any) => {
    const instance = this.initializeInstance();
    instance.interceptors.request.use(
      (config: any) => {
        // const token = getStorage(Constants.AUTH_TOKEN);
        config.headers = {
          Authorization: `Bearer ${this.token}`,
        };

        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    return instance({
      url,
      method,
      data,
    });
  };
  getSuppliers = () => {
    const url = "/supplier/records";
    return this.authClient(url, "get", {});
  };
};

export default Api;
