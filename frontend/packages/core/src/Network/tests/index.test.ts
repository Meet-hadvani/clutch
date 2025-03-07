import type { AxiosError, AxiosResponse } from "axios";

import type { ClutchError } from "../errors";
import { client, errorInterceptor, successProxyInterceptor } from "../index";

describe("error interceptor", () => {
  describe("on axios error", () => {
    let err: Promise<ClutchError>;
    beforeAll(() => {
      err = errorInterceptor({
        message: "Request timeout of 1ms reached",
        isAxiosError: true,
      } as AxiosError);
    });

    it("returns a ClutchError", () => {
      return expect(err).rejects.toEqual({
        status: {
          code: 500,
          text: "Client Error",
        },
        message: "Request timeout of 1ms reached",
      });
    });
  });

  describe("on auth error", () => {
    let window;
    const axiosError = {
      response: {
        status: 401,
        statusText: "Not Authorized",
        data: {
          code: 16,
          message: "Whoops!",
        },
      },
    } as AxiosError;

    beforeAll(() => {
      window = global.window;
      global.window ??= Object.create(window);
      Object.defineProperty(window, "location", {
        value: {
          href: "/example?foo=bar",
          pathname: "/example",
          search: "?foo=bar",
        },
        writable: true,
      });

      errorInterceptor(axiosError).catch(_ => _);
    });

    afterAll(() => {
      global.window ??= window;
    });

    it("redirects to provided url", () => {
      expect(window.location.href).toBe("/v1/authn/login?redirect_url=%2Fexample%3Ffoo%3Dbar");
    });
  });

  describe("on known error", () => {
    const axiosError = {
      response: {
        status: 404,
        statusText: "Not Found",
        data: {
          code: 5,
          message: "Could not find resource",
        },
      },
    } as AxiosError;
    let err: Promise<ClutchError>;
    beforeAll(() => {
      err = errorInterceptor(axiosError);
    });

    it("returns a ClutchError", () => {
      return expect(err).rejects.toEqual({
        code: 5,
        message: "Could not find resource",
        status: {
          code: 404,
          text: "Not Found",
        },
      });
    });
  });

  describe("on unknown error", () => {
    let window;
    let err: Promise<ClutchError>;
    beforeAll(() => {
      window = global.window;
      global.window ??= Object.create(window);
      Object.defineProperty(window, "location", {
        value: {
          href: "/example?foo=bar",
          pathname: "/example",
          search: "?foo=bar",
        },
        writable: true,
      });
      err = errorInterceptor({
        isAxiosError: false,
        message: "Unauthorized to perform action",
        response: {
          data: {},
          status: 401,
          statusText: "Unauthenticated",
          headers: {},
          config: {},
        },
        config: {},
        name: "foobar",
        toJSON: () => {
          return {};
        },
      });
    });

    afterAll(() => {
      global.window ??= window;
    });

    it("returns a ClutchError", () => {
      return expect(err).rejects.toEqual({
        data: {},
        message: "Unauthorized to perform action",
        status: {
          code: 401,
          text: "Unauthenticated",
        },
      });
    });
  });
});

describe("axios client", () => {
  it("treats status codes >= 400 as error", () => {
    expect(client.defaults.validateStatus(400)).toBe(false);
  });

  it("treats status codes >= 500 as error", () => {
    expect(client.defaults.validateStatus(500)).toBe(false);
  });

  it("treats status codes < 400 as success", () => {
    expect(client.defaults.validateStatus(399)).toBe(true);
  });
});

describe("axios success proxy interceptor", () => {
  it("returns an error if the proxy call returns response.data.httpStatus >= 400", async () => {
    const response = {
      status: 200,
      statusText: "Not Found",
      data: {
        httpStatus: 404,
        headers: {
          "Cache-Control": ["no-cache"],
        },
        response: {
          message: "Item not found",
        },
      },
    } as AxiosResponse;

    const err = {
      status: {
        code: 404,
        text: "Not Found",
      },
      message: "Item not found",
      data: response.data,
    } as ClutchError;

    await expect(successProxyInterceptor(response)).rejects.toEqual(err);
  });
});
