import request from "supertest";

jest.mock("../src/middleware/auth.middleware", () => ({
  authenticate: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

import app from "../src/app";

describe("GET /health", () => {
  it("should return status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: "ok",
    });
  });
});

describe("GET /", () => {
  it("should return backend funcionando", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Backend funcionando");
  });
});