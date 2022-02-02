const TTFactory = artifacts.require("TourTokenFactory");
const TourToken = artifacts.require("TourTokenTemplate");
const BFactory = artifacts.require("BFactory");
const BPool = artifacts.require("BPool");
const TToken = artifacts.require("TToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Overall", function (/* accounts */) {

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
        btx = await factory.newBPool();
        bpoolAddress = tx.logs[0].args.pool;
        bpool = await BPool.at(poolAddress);

        ttfactory = await TTFactory.deployed();
        ttcreationEvent = await factory.createToken("1234", "TOUR1234", "TOUR1234", 10);
        ttnewTourTokenAddress = creationEvent.logs[0].args['0'];
        ttnewTourToken = await TourToken.at(newTourTokenAddress);
    });
});