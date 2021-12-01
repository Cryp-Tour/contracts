const pool = artifacts.require("Pool");
const tour = artifacts.require("TourToken");
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("pool", accounts => {
  it("initialize", async function () {
    let Pool_contract = await pool.deployed();
    let Token_contract = await tour.deployed();

    let state = await Pool_contract.state.call()
    assert.equal(state, 1)

    let ethPool = await Pool_contract.ethPool.call();
    assert.equal(ethPool, 0);

    let tourPool = await Pool_contract.tourPool.call();
    assert.equal(tourPool, 0);
  })

  it("add initial Liquidity", async function () {
    let Pool_contract = await pool.deployed();
    let Token_contract = await tour.deployed();

    let state = await Pool_contract.state.call();
    assert.equal(state, 1);

    await Token_contract.approve(Pool_contract.address, 200);

    await Pool_contract.addInitialLiquidity(200, { value: 10000 });

    let ethPool = await Pool_contract.ethPool.call();
    assert.equal(ethPool, 10000);
    
    let tourPool = await Pool_contract.tourPool.call();
    assert.equal(tourPool, 200)
  })

  it("activate Pool", async function () {
    let Pool_contract = await pool.deployed();
    
    let state = await Pool_contract.state.call()
    assert.equal(state, 1, "State is wrong before Activation");

    let ethPool = await Pool_contract.ethPool.call();
    assert.equal(ethPool > 0, true);

    let tourPool = await Pool_contract.tourPool.call();
    assert.equal(tourPool > 0, true);

    await Pool_contract.activate(10000, {from: accounts[0]});

    let poolBalance = await Pool_contract.balanceOf(accounts[0]);
    assert.equal(poolBalance, 10000);

    state = await Pool_contract.state.call();
    assert.equal(state, 2, "State is wrong after Activation");
  })

  it("swap to ETH", async function () {
    let Pool_contract = await pool.deployed();
    let Token_contract = await tour.deployed();
    
    let state = await Pool_contract.state.call()
    assert.equal(state, 2, "Contract is inactive");

    await Token_contract.approve(Pool_contract.address, 100);

    await Pool_contract.swapToETH(100)

    let ethPool = await Pool_contract.ethPool.call();
    assert.equal(ethPool, 6666);

    let tourPool = await Pool_contract.tourPool.call();
    assert.equal(tourPool, 300);
  })

  it("swap to TOUR", async function () {
    let Pool_contract = await pool.deployed();
    let Token_contract = await tour.deployed();
    
    let state = await Pool_contract.state.call()
    assert.equal(state, 2, "Contract is inactive");
    
    await Pool_contract.swapToTour({ from: accounts[0], value: 2})

    let ethPool = await Pool_contract.ethPool.call();
    assert.equal(ethPool, 6668);

    let tourPool = await Pool_contract.tourPool.call();
    assert.equal(tourPool, 299);
  })

  it("add Liquidity", async function () {
    let Pool_contract = await pool.deployed();
    let Token_contract = await tour.deployed();

    let state = await Pool_contract.state.call()
    assert.equal(state, 2, "Contract is inactive");

    await Token_contract.approve(Pool_contract.address, 100);

    await Pool_contract.addLiquidity({ value: 1000, from: accounts[0]})

    let ethPool = await Pool_contract.ethPool.call();
    assert.equal(ethPool, 7668);

    let tourPool = await Pool_contract.tourPool.call();
    assert.equal(tourPool, 343);    

  })

});

