import Duration from ".";
import assert from "assert";

describe("check README results", () => {
  it("1M seconds", () => {
    const output = Duration.of(10 ** 9).toString();
    console.log(output);

    assert.strictEqual(output, "1w 4d 13h 46min 40s");
  });
});
