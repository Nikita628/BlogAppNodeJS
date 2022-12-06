import { it } from "mocha";
import { expect } from "chai";

function add(a: number, b: number) {
  return a + b;
}

describe("just starting test", () => {
  it("should add numbers correctly", () => {
    const sum = add(3, 3);
    expect(sum).to.equal(6);
  });
});
