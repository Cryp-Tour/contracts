const BFactory = artifacts.require("BFactory");
const BPool = artifacts.require("BPool");
const TToken = artifacts.require("TToken")
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("BFactory", function (/* accounts */) {
  let factory;
  let pool;
  let tx;
  let poolAddress;
  before(async () => {
    factory = await BFactory.deployed();
    tx = await factory.newBPool();
    poolAddress = tx.logs[0].args.pool;
    pool = await BPool.at(poolAddress);
  });
  it("creates new pool", async () => {
      assert.equal(await pool.symbol.call(), "CPT");
    });
  it("isBPool returns true on new pool", async () => {
      assert.isTrue(await factory.isBPool.call(poolAddress));
    })
});
