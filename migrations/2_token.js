const TourToken = artifacts.require("TourToken");

module.exports = function(deployer) {
  deployer.deploy(TourToken, "Cryp-Tour", "TOUR", 400);
};
