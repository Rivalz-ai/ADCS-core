// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {CounterPlugin} from "../src/CounterPlugin.sol";
import {EntryPoint} from "@eth-infinitism/account-abstraction/core/EntryPoint.sol";
import {UserOperation} from "@eth-infinitism/account-abstraction/interfaces/UserOperation.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract IncrementCounter is Script {
    using ECDSA for bytes32;

    address constant ACCOUNT_ADDRESS = 0x39F8BA6093f8fB95d9c890767B9f4996cCF63fdd;
    address constant COUNTER_PLUGIN = 0x7dd122b2f0cd38196fb26803B68E21687D6F058C;
    address constant ENTRY_POINT = 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789;

    function run() external {
        uint256 ownerKey = vm.envUint("PRIVATE_KEY");
        address owner = vm.addr(ownerKey);
        EntryPoint entryPoint = EntryPoint(payable(ENTRY_POINT));

        console2.log("\n=== Before Operation ===");
        console2.log("Current counter value:", CounterPlugin(COUNTER_PLUGIN).count(ACCOUNT_ADDRESS));
        
        UserOperation memory userOp = UserOperation({
            sender: ACCOUNT_ADDRESS,
            nonce: entryPoint.getNonce(ACCOUNT_ADDRESS, 0),
            initCode: "",
            callData: abi.encodeCall(CounterPlugin.increment, ()),
            callGasLimit: 2000000,              // Increased more
            verificationGasLimit: 3000000,
            preVerificationGas: 100000,
            maxFeePerGas: 1000000000,          // 1 gwei
            maxPriorityFeePerGas: 1000000000,  // 1 gwei
            paymasterAndData: "",
            signature: ""
        });

        bytes32 userOpHash = entryPoint.getUserOpHash(userOp);
        bytes32 messageHash = userOpHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerKey, messageHash);
        userOp.signature = abi.encodePacked(r, s, v);

        UserOperation[] memory userOps = new UserOperation[](1);
        userOps[0] = userOp;

        console2.log("\n=== Executing Operation ===");
        vm.startBroadcast(ownerKey);
        try entryPoint.handleOps{gas: 20000000}(userOps, payable(owner)) {
            console2.log("Successfully handled UserOperation");
        } catch Error(string memory reason) {
            console2.log("HandleOps failed:", reason);
            revert(reason);
        } catch (bytes memory revertData) {
            string memory revertString = _getRevertMsg(revertData);
            console2.log("HandleOps failed with raw error:", revertString);
            revert(revertString);
        }
        vm.stopBroadcast();

        console2.log("\n=== After Operation ===");
        console2.log("Final counter value:", CounterPlugin(COUNTER_PLUGIN).count(ACCOUNT_ADDRESS));
    }

    function _getRevertMsg(bytes memory _returnData) internal pure returns (string memory) {
        // If the _returnData length is less than 68, then the transaction failed silently (without a revert message)
        if (_returnData.length < 68) return 'Transaction reverted silently';
        assembly {
            // Slice the sighash of the revert string
            _returnData := add(_returnData, 0x04)
        }
        return abi.decode(_returnData, (string));
    }

    function getNonce() external view {
        // Get the current nonce from the entry point
        EntryPoint entryPoint = EntryPoint(payable(ENTRY_POINT));
        uint256 nonce = entryPoint.getNonce(ACCOUNT_ADDRESS, 0);
        console2.log("Current nonce:", nonce);
    }

    // Helper function to check deposits
    function checkDeposit() external view {
        EntryPoint entryPoint = EntryPoint(payable(ENTRY_POINT));
        uint256 deposit = entryPoint.balanceOf(ACCOUNT_ADDRESS);
        console2.log("Account deposit in EntryPoint:", deposit);
    }

    function checkStates() external view {
        EntryPoint entryPoint = EntryPoint(payable(ENTRY_POINT));
        
        console2.log("\n=== Current States ===");
        console2.log("EntryPoint address:", ENTRY_POINT);
        console2.log("Account address:", ACCOUNT_ADDRESS);
        console2.log("Counter Plugin address:", COUNTER_PLUGIN);
        console2.log("EntryPoint balance for account:", entryPoint.balanceOf(ACCOUNT_ADDRESS));
        console2.log("Current nonce:", entryPoint.getNonce(ACCOUNT_ADDRESS, 0));
        
        // Check if Counter Plugin has code
        uint256 codeSize;
        address counterPlugin = COUNTER_PLUGIN;
        assembly {
            codeSize := extcodesize(counterPlugin)
        }
        console2.log("Counter Plugin code size:", codeSize);
        
        // Try to read current count
        try CounterPlugin(COUNTER_PLUGIN).count(ACCOUNT_ADDRESS) returns (uint256 count) {
            console2.log("Current counter value:", count);
        } catch {
            console2.log("Failed to read counter value");
        }
    }
} 