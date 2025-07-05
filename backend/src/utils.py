"""
Utility functions for the DAO Treasury Management system.
"""

from web3 import Web3
from eth_abi.abi import encode

def encode_strategy_call(strategy_address: str, token_address: str, amount: int) -> bytes:
    """
    Encode the call to Strategy.executeStrategy1()
    """
    # Function signature: executeStrategy1(address,uint256)
    function_selector = Web3.keccak(text="executeStrategy1(address,uint256)")[:4]
    
    # Encode parameters
    encoded_params = encode(['address', 'uint256'], [token_address, amount])
    
    return function_selector + encoded_params

def encode_treasury_execute_call(strategy_address: str, token_address: str, amount: int) -> bytes:
    """
    Encode the call to Treasury.execute() that will call Strategy.executeStrategy1()
    """
    # Get the encoded call to strategy
    strategy_call_data = encode_strategy_call(strategy_address, token_address, amount)
    
    # Function signature: execute(address,uint256,bytes)
    function_selector = Web3.keccak(text="execute(address,uint256,bytes)")[:4]
    
    # Encode parameters for Treasury.execute()
    # target = strategy_address, value = 0 (no ETH), data = strategy_call_data
    encoded_params = encode(
        ['address', 'uint256', 'bytes'],
        [strategy_address, 0, strategy_call_data]
    )
    
    return function_selector + encoded_params

def create_proposal_parameters(treasury_address: str, strategy_address: str, eth_token_address: str) -> tuple[list[str], list[int], list[bytes], str]:
    """
    Create the parameters needed for Governor.propose()
    """
    # Encode the call to Treasury.execute()
    treasury_call_data = encode_treasury_execute_call(
        strategy_address,
        eth_token_address,
        Web3.to_wei(1, 'ether')
    )
    
    # Proposal parameters
    targets = [treasury_address]  # Call the Treasury contract
    values = [0]  # No ETH to send
    calldatas = [treasury_call_data]  # Encoded function call
    
    # Format description with actual values
    formatted_description = """
    # Execute Strategy 1 (Aave-like Protocol)
    
    ## Summary
    This proposal executes Strategy 1 through our Treasury contract to deposit funds into an Aave-like protocol.
    
    ## Strategy Details
    - Strategy: Aave Protocol
    - Expected APY: 7.20%
    - TVL: $450M
    - Risk-Adjusted Returns: 1.80 Sharpe ratio
    - Withdrawal Liquidity: 85%
    
    ## Technical Details
    - Target: Treasury.execute() -> Strategy.executeStrategy1()
    - Token: {token_address}
    - Amount: {amount} tokens
    """.format(
        token_address=eth_token_address,
        amount=Web3.from_wei(Web3.to_wei(1, 'ether'), 'ether')
    )
    
    return targets, values, calldatas, formatted_description 