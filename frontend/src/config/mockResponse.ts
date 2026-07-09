import type { AxiosResponse } from "axios";

export function mockResponse<T>(data: T): Promise<AxiosResponse<T>> {
  return Promise.resolve({
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as never,
  } as AxiosResponse<T>);
}
