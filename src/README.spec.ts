import assert from "assert";
import { durationToString } from ".";

const now = new Date();

describe("check README results", () => {
  it("1M seconds", () => {
    const output = durationToString(now, new Date(+now + 10 ** 9));
    console.log(output);

    assert.strictEqual(output, "1w 4d 13h 46min 40s");
  });
});
