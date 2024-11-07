// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {CounterPlugin} from "../src/CounterPlugin.sol";
import {IPluginManager} from "@alchemy/modular-account/src/interfaces/IPluginManager.sol";
import {IMultiOwnerPlugin} from "@alchemy/modular-account/src/plugins/owner/IMultiOwnerPlugin.sol";
import {FunctionReference} from "@alchemy/modular-account/src/interfaces/IPluginManager.sol";
import {FunctionReferenceLib} from "@alchemy/modular-account/src/helpers/FunctionReferenceLib.sol";
import {UpgradeableModularAccount} from "@alchemy/modular-account/src/account/UpgradeableModularAccount.sol";

contract InstallCounterPlugin is Script {
    // Your modular account address
    address constant ACCOUNT_ADDRESS = 0x39F8BA6093f8fB95d9c890767B9f4996cCF63fdd;
    address constant MULTI_OWNER_ADDRESS = 0xcE0000007B008F50d762D155002600004cD6c647;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
   
        // 1. Deploy the Counter Plugin
        CounterPlugin counterPlugin = new CounterPlugin();
        console2.log("CounterPlugin deployed to:", address(counterPlugin));

        // 2. Get the plugin manager interface of the account
        UpgradeableModularAccount account = UpgradeableModularAccount(payable(ACCOUNT_ADDRESS));

        // 3. Calculate manifest hash
        bytes32 manifestHash = keccak256(abi.encode(counterPlugin.pluginManifest()));

        // 4. Prepare dependencies - using the MultiOwnerPlugin's USER_OP_VALIDATION_OWNER function
        FunctionReference[] memory dependencies = new FunctionReference[](1);
        dependencies[0] = FunctionReferenceLib.pack(
            MULTI_OWNER_ADDRESS, // The account address implements MultiOwnerPlugin
            uint8(IMultiOwnerPlugin.FunctionId.USER_OP_VALIDATION_OWNER)
        );

        // 5. Install the plugin
        account.installPlugin({
            plugin: address(counterPlugin),
            manifestHash: manifestHash,
            pluginInstallData: "0x",
            dependencies: dependencies
        });

        console2.log("CounterPlugin installed on account:", ACCOUNT_ADDRESS);

        vm.stopBroadcast();
    }
} 