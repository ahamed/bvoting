pragma solidity >=0.4.22 <0.7.0;

contract Registration {
    address electionCommissioner;
    bool registrationStatus = true;

    struct Voter {
        address voterAddress;
        bytes32 voterHash;
        bytes32 region;
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
    
    function registerVoter(bytes32 _nid, bytes32 _voterHash, bytes32 _region) public {
        require(registrationStatus, 'Registration Process not yet opened! Please wait for opening the registration being open.');
        require(!isAlreadyRegistered(_voterHash), 'You are already registered!');

        voters[_nid] = Voter({voterAddress: msg.sender, voterHash: _voterHash, region: _region, isRegistered: true, coin: 1});
        nids.push(_nid);
        emit RegistrationCompleted(true);
    }
    
    function isAlreadyRegistered(bytes32 _nid) public view returns(bool) {
        return voters[_nid].isRegistered;
    }

    function authorizeVoter(bytes32 _nid, bytes32 _voterHash, bytes32 _region) public view returns(bool) {
        return voters[_nid].isRegistered
            && voters[_nid].voterHash == _voterHash
            && voters[_nid].region == _region;
    }
    
    
    function getVoter(bytes32 _nid) public view returns (address, bytes32, bytes32, bool, uint) {
        Voter memory v = voters[_nid];
        return (v.voterAddress, v.voterHash, v.region, v.isRegistered, v.coin);
    }
    
    function getVoters() public view returns (bytes32[] memory) {
        return nids;
    }

    function removeVoteCoinFromTheVoter(bytes32 _nid) public {
        require(isAlreadyRegistered(_nid), 'Invalid Voter Information');
        voters[_nid].coin = 0;
    }

    function voterCanVote(bytes32 _nid) public view returns(bool) {
        require(isAlreadyRegistered(_nid), 'Invalid Voter Information');
        return voters[_nid].coin == 1;
    }
}