import { expect } from "chai";
import { createError, createNotFoundError } from "../../utils/error";

describe("testing error utility functions", () => {
  before(() => {
    console.log("initialization");
  });

  after(() => {
    console.log("cleanup");
  });

  it("should create not found error", () => {
    const error = createNotFoundError("not found");

    expect(error).not.to.equal(null);
    expect(error.message).to.equal("not found");
    expect(error.status).to.equal(404);
    expect(error.errors).to.deep.equal([]);
  });

  it("should create error", () => {
    const error = createError("error", 500);

    expect(error).not.to.equal(null);
    expect(error.message).to.equal("error");
    expect(error.status).to.equal(500);
    expect(error.errors).to.deep.equal([]);
  });
});
