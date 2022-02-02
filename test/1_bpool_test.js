const BFactory = artifacts.require("BFactory");
const BPool = artifacts.require("BPool");
const TToken = artifacts.require("TToken");

const { toWei } = web3.utils;
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("BFactory and BPool", function (accounts) {
  let factory;
  let pool;
  let tx;
  let poolAddress;
  let weth;
  let dai;
  let wethAddress;
  let daiAddress;

  let account1 = accounts[0];

  before(async () => {
    factory = await BFactory.deployed();
    tx = await factory.newBPool();
    poolAddress = tx.logs[0].args.pool;
    pool = await BPool.at(poolAddress);

    weth = await TToken.new('Wrapped ETH', 'WETH', 20);
    dai = await TToken.new('DAI', 'DAI', 200);
    wethAddress = weth.address;
    daiAddress = dai.address;

    await weth.mint(account1, toWei('25'));
    await dai.mint(account1, toWei('40000'));

    await weth.approve(poolAddress, toWei('25'));
    await dai.approve(poolAddress, toWei('40000'));

  });
  it("creates new pool", async () => {
    assert.equal(await pool.symbol.call(), "CPT");
  });
  it("isBPool returns true on new pool", async () => {
    assert.isTrue(await factory.isBPool.call(poolAddress));
  });
  it("No bound Tokens at the start", async () => {
    const numTokens = await pool.getNumTokens();
    assert.equal(0, numTokens);
    const isBound = await pool.isBound.call(wethAddress);
    assert(!isBound);
  });
  it("Binds tokens to pool", async () => {
    // Equal weights WETH, MKR, DAI
    await pool.bind(wethAddress, toWei('5'), toWei('5'));
    await pool.bind(daiAddress, toWei('10000'), toWei('5'));
    const numTokens = await pool.getNumTokens({gasPrice: 0});
    assert.equal(2, numTokens);
  })

});
