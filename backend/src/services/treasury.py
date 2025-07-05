"""
Treasury service for interacting with the Treasury contract.
"""

from web3 import Web3
from ..models import TreasuryData
from ..abis import TREASURY_ABI, ETHToken_ABI

class TreasuryService:
    """Service for interacting with the Treasury contract"""
    
    def __init__(self, rpc_url: str):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        if not self.w3.is_connected():
            raise ValueError(f"Failed to connect to RPC: {rpc_url}")
    
    def get_treasury_data(self, treasury_address: str, eth_token_address: str) -> TreasuryData:
        """Get treasury balance data"""
        treasury_contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(treasury_address),
            abi=TREASURY_ABI
        )
        
        eth_token_contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(eth_token_address),
            abi=ETHToken_ABI
        )
        
        # Get ETH balance
        eth_balance = treasury_contract.functions.getEtherBalance().call()
        
        # Get ETHToken balance
        eth_token_balance = treasury_contract.functions.getTokenBalance(eth_token_address).call()
        
        # Get token symbol
        eth_token_symbol = eth_token_contract.functions.symbol().call()
        
        # Calculate total value (simplified - in real implementation you'd get ETH price)
        eth_price_usd = 2000  # Mock price for demo
        total_value_usd = (eth_balance / 1e18) * eth_price_usd
        
        return TreasuryData(
            treasury_address=treasury_address,
            eth_balance=eth_balance,
            eth_token_balance=eth_token_balance,
            eth_token_symbol=eth_token_symbol,
            total_value_usd=total_value_usd
        ) 