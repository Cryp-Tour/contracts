const BFactory = artifacts.require("BFactory");
const BPool = artifacts.require("BPool");
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("BFactory", function (/* accounts */) {
  it("is deployed", async function () {
    let contr = undefined;
    try {
      contr = await BFactory.deployed();
    } catch (error) {}
    return assert.notEqual(contr, undefined);
  });
  it("creates new pools", async function () {
    let factory = await BFactory.deployed();
    let tx = await factory.newBPool();
    let poolAddress = tx.logs[0].args.pool; 
    let pool = await BPool.at(poolAddress);
    assert.equal(await pool.symbol.call(), "CPT");

  });
});
