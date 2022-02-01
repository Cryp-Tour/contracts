const TTFactory = artifacts.require("TourTokenFactory");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("TTFactory", function (/* accounts */) {
  it("should add one to Count", async function () {
    factory = await TTFactory.deployed();
    let countbefore = await factory.getCurrentTokenCount.call();
    console.log(countbefore)
    await factory.createToken("1234", "TOUR1234", "TOUR1234", 10)
    let countafter = await factory.getCurrentTokenCount.call();
    console.log(countafter)
    return assert.equal(countbefore.toNumber() + 1, countafter);
  });
});
