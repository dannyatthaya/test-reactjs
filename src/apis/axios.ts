import axios, { AxiosError } from "axios";
import { forEach, mapKeys, snakeCase } from "lodash";

const handleResponseError = (error: AxiosError) => {
  if (error.response) {
    const data = error.response.data as Axios.Response<any>;

    const message = data.error ?? data.message ?? error.message ?? data.message;

    return Promise.reject(message);
  } else if (error.request) {
    return Promise.reject(error.message);
  } else {
    return Promise.reject(error.message);
  }
};

function createResource() {
  const instance = axios.create({
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
    withCredentials: false,
  });

  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return Promise.resolve(response.data);
    },
    (error) => {
      return handleResponseError(error);
    }
  );

  return instance;
}

export const qs = (url: string, queryString?: Object): string => {
  const dirtyUrl = new URL(`${import.meta.env.VITE_API_URL}${url}`);

  if (queryString) {
    forEach(queryString, (value, key) => {
      if (value) {
        dirtyUrl.searchParams.append(key, value.toString());
      }
    });
  }

  return dirtyUrl.href;
};

export const parseData = (data: Object) => {
  // change all keys from data from camelcase to snake_case
  return mapKeys(data, (_, key) => snakeCase(key));
}

export default createResource();