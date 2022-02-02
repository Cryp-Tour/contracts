const TTFactory = artifacts.require("TourTokenFactory");
const TourToken = artifacts.require("TourTokenTemplate");
const BFactory = artifacts.require("BFactory");
const BPool = artifacts.require("BPool");
const TToken = artifacts.require("TToken");

const { toWei } = web3.utils;
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Overall", function (accounts) {

  let bfactory;
  let bpool;
  let btx;
  let bpoolAddress;

  let ttfactory;
  let ttcreationEvent;
  let ttnewTourTokenAddress;
  let ttnewTourToken;
  before(async () => {
    bfactory = await BFactory.deployed();
    btx = await bfactory.newBPool();
    bpoolAddress = btx.logs[0].args.pool;
    bpool = await BPool.at(bpoolAddress);

    weth = await TToken.new('Wrapped ETH', 'WETH', 20);
    wethAddress = weth.address;
    await weth.mint(accounts[0], toWei('25'));

    ttfactory = await TTFactory.deployed();
    ttcreationEvent = await ttfactory.createToken("1234", "TOUR1234", "TOUR1234", toWei('50'));
    ttnewTourTokenAddress = ttcreationEvent.logs[0].args['0'];
    ttnewTourToken = await TourToken.at(ttnewTourTokenAddress);
  });
  it("Creator has TourTokens", async () => {
    await ttnewTourToken.mint(accounts[0], toWei('10'));
    assert.isTrue(await ttnewTourToken.balanceOf.call(accounts[0]) > 0);
  });
  it("Approve TourToken and WETH", async () => {
    await ttnewTourToken.approve(bpoolAddress, toWei('5'));
    await weth.approve(bpoolAddress, toWei('25'));
  });
  it("Bind TourToken to pool", async () => {
    await bpool.bind(ttnewTourTokenAddress, toWei('5'), toWei('2'));
    const numTokens = await bpool.getNumTokens({ gasPrice: 0 });
    assert.equal(1, numTokens);
  });
  it("Bind WETH to pool", async () => {
    await bpool.bind(wethAddress, toWei('5'), toWei('2'))
    const numTokens = await bpool.getNumTokens({ gasPrice: 0 });
    assert.equal(2, numTokens);
  });
});