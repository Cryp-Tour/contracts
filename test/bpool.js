const bpool = artifacts.require("bpool");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("bpool", function (/* accounts */) {
  it("should assert true", async function () {
    // await bpool.deployed();
    return assert.isTrue(true);
  });
});
