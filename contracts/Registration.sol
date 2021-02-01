pragma solidity >=0.4.22 <0.7.0;

contract Registration {
    address electionCommissioner;
    bool registrationStatus = true;

    struct Voter {
        bool isRegistered;
        uint8 coin;
        bytes20 region;
        address voterAddress;
        bytes32 voterHash;
    }
    
    mapping(bytes20 => Voter) voters;
    bytes20[] nids;

    constructor() public {
        electionCommissioner = msg.sender;
    }
    
    modifier commissionerOnly {
        require(msg.sender == electionCommissioner, 'Only Election Commissioner can perform this task.');
        _;
    }
    
    function providerVotersVoteCoin(uint8 _coins) public commissionerOnly {
        for (uint i = 0; i < nids.length; i++) {
            voters[nids[i]].coin = _coins;
        }
    }

    function changeRegistrationStatus(bool _status) public commissionerOnly {
        registrationStatus = _status;
    }
    
    function registerVoter(bytes20 _nid, bytes32 _voterHash, bytes20 _region) public {
        require(registrationStatus, 'Registration Process not yet opened! Please wait for opening the registration being open.');
        require(!isAlreadyRegistered(_nid), 'You are already registered!');

        voters[_nid] = Voter({voterAddress: msg.sender, voterHash: _voterHash, region: _region, coin: 100, isRegistered: true});
        nids.push(_nid);
    }
    
    function isAlreadyRegistered(bytes20 _nid) public view returns(bool) {
        return voters[_nid].isRegistered;
    }

    function authorizeVoter(bytes20 _nid, bytes32 _voterHash, bytes20 _region) public view returns(bool) {
        return voters[_nid].isRegistered
            && voters[_nid].voterHash == _voterHash
            && voters[_nid].region == _region;
    }
    
    
    function getVoter(bytes20 _nid) public view returns (address, bytes32, bytes20, uint8, bool) {
        Voter memory v = voters[_nid];
        return (v.voterAddress, v.voterHash, v.region, v.coin, v.isRegistered);
    }
    
    function getVoters() public view returns (bytes20[] memory) {
        return nids;
    }

    function removeVoteCoinFromTheVoter(bytes20 _nid) public {
        require(isAlreadyRegistered(_nid), 'Invalid Voter Information');
        voters[_nid].coin = 0;
    }

    function voterCanVote(bytes20 _nid) public view returns(bool) {
        require(isAlreadyRegistered(_nid), 'Invalid Voter Information');
        return voters[_nid].coin >= 1;
    }
}