pragma solidity >=0.4.22 <0.7.0;

contract CReg {
    
    // Contract creator address i.e the commissioner
    address commissioner;
    
    // Candidate information. This contains the name, mobile, nid,
    // partyId(which contains all the party information) and the votes he/she gains.
    struct Candidate {
        bool isRegistered;
        uint16 partyId;
        bytes16 mobile;
        bytes20 nid;
        bytes20 region;
        bytes32 name;
        uint votes;
    }
    
    // Store the condidates to the nid => Candidate mapping.
    mapping(bytes20 => Candidate) candidates;
    
    // Store the nids for easy access.
    bytes20[] nids;
    
    constructor() public {
        commissioner = msg.sender;
    }
    
    // Create modifier for election Commissioner only
    modifier commissionerOnly {
        require(commissioner == msg.sender, "This task only be done by election commissioner");
        _;
    }
    
    // Check if the candidate is already registered.
    function isAlreadyRegistered (bytes20 _nid) public view returns(bool) {
        return candidates[_nid].isRegistered;
    }
    
    // Register a candidate. And this could be done only by commissioner.
    function registerCandidate(bytes32 _name, bytes16 _mobile, bytes20 _nid, bytes20 _region, uint16 _partyId) public commissionerOnly{
        require(!isAlreadyRegistered(_nid), "This candidate has already been registered!");

        nids.push(_nid);
        candidates[_nid] = Candidate({
            name: _name,
            mobile: _mobile,
            nid: _nid,
            region: _region,
            partyId: _partyId,
            isRegistered: true,
            votes: 0
        });
    }
    
        // Get all the candidates
    function getCandidates() public view returns(bytes20[] memory) {
        return nids;
    }
    
    // Get a specific candidate by NID.
    function getCandidate(bytes20 _nid) public view returns(bytes32, bytes16, bytes20, uint16, uint) {
        Candidate memory c = candidates[_nid];
        return (c.name, c.mobile, c.region, c.partyId, c.votes);
    }

    function addVotesToTheAccount(bytes20[] memory _nids) public commissionerOnly {
        for (uint i = 0; i < _nids.length; i++) {
            candidates[_nids[i]].votes++;
        }
    }
    

    function getCandidatesByRegion(bytes20 _region) public view returns(bytes20[] memory) {
        bytes20[] memory can = new bytes20[](nids.length);
        uint index = 0;
        for (uint i = 0; i < nids.length; i++) {
            if (candidates[nids[i]].region == _region) {
                can[index] = nids[i];
                index++;
            }
        }
        return can;
    }
}