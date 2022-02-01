const TTFactory = artifacts.require("TourTokenFactory");
const TourToken = artifacts.require("TourTokenTemplate");
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("TTFactory", function (/* accounts */) {
  it("is deployed", async function () {
    factory = await TTFactory.deployed();
    assert.notEqual(factory, undefined)
  })
  it("adds one to Count when creating a Token", async function () {
    factory = await TTFactory.deployed();
    let countbefore = await factory.getCurrentTokenCount.call();
    await factory.createToken("1234", "TOUR1234", "TOUR1234", 10)
    let countafter = await factory.getCurrentTokenCount.call();
    return assert.equal(countbefore.toNumber() + 1, countafter);
  });
  it("Returns right number of Events when creating new TourToken", async function () {
    factory = await TTFactory.deployed();
    let newtoken = await factory.createToken("1234", "TOUR1234", "TOUR1234", 10)
    return assert.equal(newtoken.logs.length, 3);
  });
  it("Returns right name after creating new TourToken", async function () {
    factory = await TTFactory.deployed();
    let creationEvent = await factory.createToken("1234", "TOUR1234", "TOUR1234", 10)
    let newTourTokenAddress = creationEvent.logs[0].args['0'];
    let newTourToken = await TourToken.at(newTourTokenAddress);
    let name = await newTourToken.name.call();
    return assert.equal(name, "TOUR1234");
  });
});
