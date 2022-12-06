import { expect } from "chai";
import { NextFunction, Request, Response } from "express";
import { stub } from "sinon";
import { accessControl } from "../../middleware/accessControl";

describe("testing access control middleware", () => {
  before(() => {
    console.log("initialization");
  });

  after(() => {
    console.log("cleanup");
  });

  it("should add cors headers to response", (done) => {
    const res = {
      headers: {},
      setHeader(header: string, value: string) {
        this.headers[header] = value;
      },
      getHeader(header: string) {
        return this.headers[header];
      },
    } as any as Response;

    stub(res, "setHeader"); // to inject our own implementation of some methods
    stub(res, "getHeader").returns("*");

    const req = {} as Request;
    const next = (() => {}) as NextFunction;

    accessControl(req, res, next);

    expect(res.getHeader("Access-Control-Allow-Origin")).to.equal("*");

    done(); // if testing async code
  });
});
