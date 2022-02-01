const bpool = artifacts.require("bpool");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("bpool", function (/* accounts */) {
  it("is deployed", async function () {
    let contr = undefined;
    try {
      contr = await bpool.deployed();
    } catch (error) {}
    return assert.notEqual(contr, undefined);
  });
});
