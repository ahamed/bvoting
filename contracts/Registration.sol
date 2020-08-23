pragma solidity >=0.4.22 <0.7.0;

contract Registration {
    address electionCommissioner;
    bool registrationStatus = true;

    struct Voter {
        address voterAddress;
        bytes32 voterHash;
        bool isRegistered;
        uint coin;
    }
    
    mapping(bytes32 => Voter) voters;
    bytes32[] nids;

    event ContractCreator(address _creator);

    constructor() public {
        electionCommissioner = msg.sender;
        emit ContractCreator(electionCommissioner);
    }
    
    modifier commissionerOnly {
        require(msg.sender == electionCommissioner, 'Only Election Commissioner can perform this task.');
        _;
    }

    event RegistrationCompleted(bool indexed _status);
    
    function providerVotersVoteCoin(uint _coins) public commissionerOnly {
        for (uint i = 0; i < nids.length; i++) {
            voters[nids[i]].coin = _coins;
        }
    }
    
    function changeRegistrationStatus(bool _status) public commissionerOnly {
        registrationStatus = _status;
    }
    
    function registerVoter(bytes32 _nid, bytes32 _voterHash) public {
        require(registrationStatus, 'Registration Process not yet opened! Please wait for opening the registration being open.');
        require(!isAlreadyRegistered(_voterHash), 'You are already registered!');

        voters[_nid] = Voter({voterAddress: msg.sender, voterHash: _voterHash, isRegistered: true, coin: 0});
        nids.push(_nid);
        emit RegistrationCompleted(true);
    }
    
    function isAlreadyRegistered(bytes32 _nid) public view returns(bool) {
        if (voters[_nid].isRegistered) return true;
        return false;
    }
    
    
    function getVoter(bytes32 _nid) public view returns (address, bytes32, bool, uint) {
        Voter memory v = voters[_nid];
        return (v.voterAddress, v.voterHash, v.isRegistered, v.coin);
    }
    
    function getVoters() public view returns (bytes32[] memory) {
        return nids;
    }
}