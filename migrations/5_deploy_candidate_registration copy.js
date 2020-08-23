const CandidateRegistration = artifacts.require('./CandidateRegistration');

module.exports = function (deployer) {
	deployer.deploy(CandidateRegistration);
};
