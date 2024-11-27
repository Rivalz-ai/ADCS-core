// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {CounterPlugin} from "../src/CounterPlugin.sol";

contract DeployCounterPlugin is Script {
    function run() external {
        // Retrieve the private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the Counter Plugin
        CounterPlugin counterPlugin = new CounterPlugin();

        console2.log("CounterPlugin deployed to:", address(counterPlugin));

        vm.stopBroadcast();
    }
} 