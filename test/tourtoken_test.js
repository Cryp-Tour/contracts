const TTFactory = artifacts.require("TourTokenFactory");
const TourToken = artifacts.require("TourTokenTemplate");
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("TTFactory", function (/* accounts */) {
  let factory;
  let creationEvent;
  let newTourTokenAddress;
  let newTourToken;
  before(async () => {
    factory = await TTFactory.deployed();
    creationEvent = await factory.createToken("1234", "TOUR1234", "TOUR1234", 10);
    newTourTokenAddress = creationEvent.logs[0].args['0'];
    newTourToken = await TourToken.at(newTourTokenAddress);
  })
  it("adds one to Count when creating a Token", async () => {
      let countbefore = await factory.getCurrentTokenCount.call();
      await factory.createToken("1234", "TOUR1234", "TOUR1234", 10);
      let countafter = await factory.getCurrentTokenCount.call();
      return assert.equal(countbefore.toNumber() + 1, countafter);
    });
  it("Returns right number of Events when creating new TourToken", async () => {
      return assert.equal(creationEvent.logs.length, 3);
    });
  it("Returns right name after creating new TourToken", async () => {
      let name = await newTourToken.name.call();
      return assert.equal(name, "TOUR1234");
    });
});
