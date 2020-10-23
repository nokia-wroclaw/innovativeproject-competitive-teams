import axios, { AxiosInstance, AxiosResponse } from "axios";


var BACKEND_URL="/api"

// check for local development backend url
const env_url = process.env.REACT_APP_BACKEND_URL;
const env = process.env.NODE_ENV;
if (typeof env === "string" && env === "development" && typeof env_url === "string")
  BACKEND_URL = env_url

export interface User {
  email: string;
  id: number;
  is_active: boolean;
  items: [any];
}

declare module "axios" {
  interface AxiosResponse<T = any> extends Promise<T> {}
}

abstract class HttpClient {
  protected readonly instance: AxiosInstance;

  public constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });

    this._initializeResponseInterceptor();
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError
    );
  };

  private _handleResponse = ({ data }: AxiosResponse) => data;

  protected _handleError = (error: any) => Promise.reject(error);
}

class Api extends HttpClient {
  public constructor() {
    super(BACKEND_URL);
  }

  public getUsers = () => this.instance.get<User[]>("/users/");

  public getUser = (id: string) => this.instance.get<User>(`/users/${id}`);
}

export default Api;
