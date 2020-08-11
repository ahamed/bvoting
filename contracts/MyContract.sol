pragma solidity >=0.4.21 <0.7.0;

contract MyContract {
    string public name = 'John Doe';
    address public owner;
    
    constructor() public {
        owner = msg.sender;
    }

    modifier restricted {
        require(owner == msg.sender, 'You are not allowed to perform this task');
        _;
    }

    function setName(string memory _name) public restricted {
        name = _name;
    }

    function getName() public view returns(string memory) {
        return name;
    }
}