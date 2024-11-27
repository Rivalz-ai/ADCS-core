// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {IPluginManager, FunctionReference} from "@alchemy/modular-account/src/interfaces/IPluginManager.sol";
import {IMultiOwnerPlugin} from "@alchemy/modular-account/src/plugins/owner/IMultiOwnerPlugin.sol";
import {CounterPlugin} from "../src/CounterPlugin.sol";
import {UpgradeableModularAccount} from "@alchemy/modular-account/src/account/UpgradeableModularAccount.sol";
import {IAccountLoupe} from "@alchemy/modular-account/src/interfaces/IAccountLoupe.sol";
contract GetAccountInfo is Script {
    address constant ACCOUNT_ADDRESS = 0x39F8BA6093f8fB95d9c890767B9f4996cCF63fdd;
    address constant MULTI_OWNER_ADDRESS = 0xcE0000007B008F50d762D155002600004cD6c647;


    function run() external view {
        // Get interfaces
        UpgradeableModularAccount account = UpgradeableModularAccount(payable(ACCOUNT_ADDRESS));
        IMultiOwnerPlugin multiOwner = IMultiOwnerPlugin(payable(MULTI_OWNER_ADDRESS));
        
        console2.log("=== Account Information ===");
        console2.log("Account Address:", ACCOUNT_ADDRESS);
        console2.log("Account Balance:", ACCOUNT_ADDRESS.balance);
        
        // Check if caller is owner
        address caller = vm.addr(vm.envUint("PRIVATE_KEY"));
        console2.log("\n=== Ownership Information ===");
        console2.log("Checking address:", caller);
        console2.log("Is owner:", multiOwner.isOwnerOf(ACCOUNT_ADDRESS, caller));

        // Get installed plugins
        console2.log("\n=== Plugin Information ===");
        
        // Get installed plugins from account loupe
        IAccountLoupe accountLoupe = IAccountLoupe(ACCOUNT_ADDRESS);
        address[] memory plugins = accountLoupe.getInstalledPlugins();
        
        // Check if MultiOwnerPlugin is installed by checking if account address is in plugins
        // Since MultiOwnerPlugin is implemented by the account itself
        bool isMultiOwnerInstalled = false;
        for (uint256 i = 0; i < plugins.length; i++) {
            if (plugins[i] == MULTI_OWNER_ADDRESS) {
                isMultiOwnerInstalled = true;
                break;
            }
        }
        console2.log("MultiOwner Plugin installed:", isMultiOwnerInstalled);

        // Get runtime validation function info
        console2.log("\n=== Runtime Validation Info ===");
        bytes4 incrementSelector = CounterPlugin.increment.selector;
        IAccountLoupe.ExecutionFunctionConfig memory functionReference = account.getExecutionFunctionConfig(incrementSelector);
        
        console2.log("Hook exists:", functionReference.plugin != address(0) );
    }
} 