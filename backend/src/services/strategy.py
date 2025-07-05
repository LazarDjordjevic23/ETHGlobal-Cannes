"""
Strategy service for interacting with the Strategy contract.
"""

from typing import List
from web3 import Web3
from ..models import StrategyMetrics
from ..abis import STRATEGY_ABI

class StrategyService:
    """Service for interacting with the Strategy contract"""
    
    def __init__(self, rpc_url: str):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        if not self.w3.is_connected():
            raise ValueError(f"Failed to connect to RPC: {rpc_url}")
    
    def get_all_strategies(self, strategy_address: str) -> List[StrategyMetrics]:
        """Get metrics for all three strategies"""
        strategy_contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(strategy_address),
            abi=STRATEGY_ABI
        )
        
        strategies = []
        
        # Get Strategy 1 metrics
        strategy1 = strategy_contract.functions.getStrategy1Metrics().call()
        strategies.append(StrategyMetrics(
            strategy_id=1,
            apy=strategy1[0],
            tvl=strategy1[1],
            utilization_rate=strategy1[2],
            risk_adjusted_returns=strategy1[3],
            withdrawal_liquidity=strategy1[4],
            description=strategy1[5]
        ))
        
        # Get Strategy 2 metrics
        strategy2 = strategy_contract.functions.getStrategy2Metrics().call()
        strategies.append(StrategyMetrics(
            strategy_id=2,
            apy=strategy2[0],
            tvl=strategy2[1],
            utilization_rate=strategy2[2],
            risk_adjusted_returns=strategy2[3],
            withdrawal_liquidity=strategy2[4],
            description=strategy2[5]
        ))
        
        # Get Strategy 3 metrics
        strategy3 = strategy_contract.functions.getStrategy3Metrics().call()
        strategies.append(StrategyMetrics(
            strategy_id=3,
            apy=strategy3[0],
            tvl=strategy3[1],
            utilization_rate=strategy3[2],
            risk_adjusted_returns=strategy3[3],
            withdrawal_liquidity=strategy3[4],
            description=strategy3[5]
        ))
        
        return strategies 