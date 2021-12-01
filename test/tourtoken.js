const tourtoken = artifacts.require("tourtoken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("tourtoken", function (/* accounts */) {
  it("initialize", async function () {
    let instance = await tourtoken.deployed();
    let supply = await instance.totalSupply.call();
    assert.equal(supply, 400);
  });
});
