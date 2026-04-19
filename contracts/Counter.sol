// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint public x;

    event Increment(address indexed user, uint newValue);

    function inc() public {
        x += 1;
        emit Increment(msg.sender, x);
    }
}