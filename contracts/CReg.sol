pragma solidity >=0.4.22 <0.7.0;

contract CReg {
    
    // Contract creator address i.e the commissioner
    address commissioner;
    
    // Candidate information. This contains the name, mobile, nid,
    // partyId(which contains all the party information) and the votes he/she gains.
    struct Candidate {
        bytes32 name;
        bytes32 mobile;
        bytes32 nid;
        bytes32 region;
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
    function registerCandidate(bytes32 _name, bytes32 _mobile, bytes32 _nid, bytes32 _region, uint _partyId) public commissionerOnly{
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

    function addVotesToTheAccount(bytes32[] memory _nids) public commissionerOnly {
        for (uint i = 0; i < _nids.length; i++) {
            candidates[_nids[i]].votes++;
        }
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
    function getCandidate(bytes32 _nid) public view returns(bytes32, bytes32, bytes32, uint, uint) {
        Candidate memory c = candidates[_nid];
        return (c.name, c.mobile, c.region, c.partyId, c.votes);
    }

    function getCandidatesByRegion(bytes32 _region) public view returns(bytes32[] memory) {
        bytes32[] memory can = new bytes32[](nids.length);
        uint index = 0;
        for (uint i = 0; i < nids.length; i++) {
            if (candidates[nids[i]].region == _region) {
                can[index] = nids[i];
                index++;
            }
        }
        return can;
    }

    function addVoteForCandidate(bytes32 _nid) public {
        require(isAlreadyRegistered(_nid), 'Invalid Candidate');
        candidates[_nid].votes++;
    }
}