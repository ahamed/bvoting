pragma solidity >=0.4.22 <0.7.0;

contract CReg {
    
    // Contract creator address i.e the commissioner
    address commissioner;
    
    // Candidate information. This contains the name, mobile, nid,
    // partyId(which contains all the party information) and the votes he/she gains.
    struct Candidate {
        string name;
        string mobile;
        bytes32 nid;
        uint partyId;
        bool isRegistered;
        uint votes;
    }
    
    // Store the condidates to the nid => Candidate mapping.
    mapping(bytes32 => Candidate) candidates;
    
    // Store the nids for easy access.
    bytes32[] nids;
    
    constructor() public {
        commissioner = msg.sender;
    }
    
    // Create modifier for election Commissioner only
    modifier commissionerOnly {
        require(commissioner == msg.sender, "This task only be done by election commissioner");
        _;
    }
    
    // Register a candidate. And this could be done only by commissioner.
    function registerCandidate(string memory _name, string memory _mobile, bytes32 _nid, uint _partyId) public commissionerOnly{
        require(!isAlreadyRegistered(_nid), "This candidate has already been registered!");

        nids.push(_nid);
        candidates[_nid] = Candidate({
            name: _name,
            mobile: _mobile,
            nid: _nid,
            partyId: _partyId,
            isRegistered: true,
            votes: 0
        });
    }
    
    // Check if the candidate is already registered.
    function isAlreadyRegistered (bytes32 _nid) public view returns(bool) {
        return candidates[_nid].isRegistered;
    }
    
    // Get all the candidates
    function getCandidates() public view returns(bytes32[] memory) {
        return nids;
    }
    
    // Get a specific candidate by NID.
    function getCandidate(bytes32 _nid) public view returns(string memory, string memory, uint, uint) {
        Candidate memory c = candidates[_nid];
        return (c.name, c.mobile, c.partyId, c.votes);
    }
}