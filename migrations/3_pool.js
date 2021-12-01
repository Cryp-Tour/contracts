const TourToken = artifacts.require("TourToken");
const Pool = artifacts.require("Pool");

module.exports = function(deployer) {
  deployer.deploy(Pool, TourToken.address, "Pool", "POOL", 1);
};
