const TTTemplate = artifacts.require("TourTokenTemplate");
const TTFactory = artifacts.require("TourTokenFactory");

module.exports = function (_deployer, network, accounts) {
  // Deploy Template for all TourTokens
  _deployer.deploy(TTTemplate,
    "TourToken Template",
    "TOURTEMP",
    accounts[0],
    1,
    "Just a Template",
    accounts[0]).then(() => {
      // Deploy TourToken-Factory
      return _deployer.deploy(TTFactory, TTTemplate.address,
        accounts[0])
    })
};
