from web3 import Web3
import json
import os

# Connect to an Ethereum node
# Replace with your own node URL (e.g., Infura, Alchemy, or local node)
w3 = Web3(Web3.HTTPProvider('https://rpc.ankr.com/base/dc3359a3d6c4f6866d0e59e41b886d8806cba7197232edf7412c79644595b948'))

# Contract address (replace with your contract address)
contract_address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'

# Contract ABI (replace with your contract ABI)
contract_abi = json.loads('''
[
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "type": "function"
    }
]
''')

# Create contract instance
contract = w3.eth.contract(address=contract_address, abi=contract_abi)

def read_from_contract(contract, function_name, *args):
    """
    Read data from a smart contract.
    
    :param contract: Web3 contract instance
    :param function_name: Name of the function to call
    :param args: Arguments to pass to the function
    :return: Result of the function call
    """
    try:
        function = getattr(contract.functions, function_name)
        result = function(*args).call()
        return result
    except Exception as e:
        print(f"Error reading from contract: {e}")
        return None

def write_to_contract(w3, contract, account, function_name, *args):
    """
    Write data to a smart contract.
    
    :param w3: Web3 instance
    :param contract: Web3 contract instance
    :param account: Account to use for the transaction
    :param function_name: Name of the function to call
    :param args: Arguments to pass to the function
    :return: Transaction receipt
    """
    try:
        function = getattr(contract.functions, function_name)
        nonce = w3.eth.get_transaction_count(account.address)
        
        txn = function(*args).build_transaction({
            'from': account.address,
            'nonce': nonce,
        })
        
        signed_txn = account.sign_transaction(txn)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return tx_receipt
    except Exception as e:
        print(f"Error writing to contract: {e}")
        return None

# Example usage of the new functions:
if w3.is_connected():
    # Read example
    name = read_from_contract(contract, 'name')
    symbol = read_from_contract(contract, 'symbol')
    print(f"Token Name: {name}")
    print(f"Token Symbol: {symbol}")

    # Write example (commented out for safety)
    '''
    private_key = os.getenv('ETHEREUM_PRIVATE_KEY')
    account = w3.eth.account.from_key(private_key)
    
    # Assuming there's a function called 'setValue' that takes an integer argument
    tx_receipt = write_to_contract(w3, contract, account, 'setValue', 42)
    if tx_receipt:
        print(f"Transaction successful. Hash: {tx_receipt['transactionHash'].hex()}")
    '''
else:
    print("Not connected to Ethereum network")
