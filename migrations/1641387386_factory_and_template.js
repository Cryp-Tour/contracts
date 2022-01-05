const TourTokenTemplate = artifacts.require("TourTokenTemplate");
const TTFactory = artifacts.require("DTFactory");

module.exports = function (_deployer, network, accounts) {
  // Deploy Template for all TourTokens
  _deployer.deploy(TourTokenTemplate,
    "TourToken Template",
    "TOURTEMP",
    accounts[0],
    1,
    "Just a Template",
    accounts[0]).then(() => {
      // Deploy TourToken-Factory
      return _deployer.deploy(TTFactory, TourTokenTemplate.address,
        accounts[0])
    })
};
