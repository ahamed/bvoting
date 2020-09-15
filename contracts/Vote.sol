pragma solidity >=0.4.22 <0.7.0;
pragma experimental ABIEncoderV2;

contract Vote {
    uint total = 0;
    bool counted = false;

    address EC;

    constructor() public {
        EC = msg.sender;
    }

    modifier ECOnly {
        require(EC == msg.sender, "This task only be done by election commissioner");
        _;
    }

    struct Cast {
        uint id;
        bytes32 who;
        string whom;
    }
    
    mapping(uint => Cast) votes;
    uint[] ids;

    event SendNumber(uint indexed id, bytes32 indexed who);

    function addVote(bytes32 _who, string memory _whom) public {
        uint id = total++;
        votes[id] = Cast({id: id, who: _who, whom: _whom});
        ids.push(id);
        emit SendNumber(id, _who);
    }

    function getCandidates() public ECOnly view returns (string[] memory) {
        require(!counted, 'The votes already counted!');
        string[] memory whoms = new string[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            whoms[i] = votes[ids[i]].whom;
        }
        return whoms;
    }
    
    function getVotes() public view returns (uint[] memory) {
        return ids;
    }

    function getVote(uint _id) public view returns (uint, bytes32, string memory) {
        Cast memory vt = votes[_id];
        return (vt.id, vt.who, vt.whom);
    }
    
    function countTotalVotes() public view returns (uint) {
        return total;
    }

    function markAsCounted() public ECOnly {
        counted = true;
    }
    
    function isAlreadyCounted() public ECOnly view returns (bool) {
        return counted;
    }
}