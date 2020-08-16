pragma solidity >=0.4.22 <0.7.0;

contract Registration {
    address electionCommissioner;
    bool registrationStatus = true;

    struct Voter {
        address voterAddress;
        bool isRegistered;
        uint coin;
    }
    
    mapping(bytes32 => Voter) voters;
    mapping(address => bool) votersAddress;
    bytes32[] votersHash;

    constructor() public {
        electionCommissioner = msg.sender;
    }
    
    modifier commissionerOnly {
        require(msg.sender == electionCommissioner, 'Only Election Commissioner can perform this task.');
        _;
    }

    event RegistrationCompleted(bool indexed _status);
    
    function providerVotersVoteCoin() public commissionerOnly {
        for (uint i = 0; i < votersHash.length; i++) {
            voters[votersHash[i]].coin = 1;
        }
    }
    
    function changeRegistrationStatus(bool _status) public commissionerOnly {
        registrationStatus = _status;
    }
    
    function registerVoter(bytes32 _voterHash) public {
        require(registrationStatus, 'Registration Process not yet opened! Please wait for opening the registration being open.');
        require(!isAlreadyRegistered(_voterHash), 'You are already registered!');

        voters[_voterHash] = Voter({voterAddress: msg.sender, isRegistered: true, coin: 0});
        votersHash.push(_voterHash);
        votersAddress[msg.sender] = true;
        emit RegistrationCompleted(true);
    }
    
    function isAlreadyRegistered(bytes32 _voterHash) public view returns(bool) {
        if (voters[_voterHash].isRegistered) return true;
        return false;
    }
    
    function isElectionComissioner(address _address) public view returns(bool) {
        if (_address == electionCommissioner) return true;
        return false;
    }
    
    function getVoter(bytes32 _voterHash) public view returns (address, bool, uint) {
        Voter memory v = voters[_voterHash];
        return (v.voterAddress, v.isRegistered, v.coin);
    }
    
    function getVoters() public view returns (bytes32[] memory) {
        return votersHash;
    }
}