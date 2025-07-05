"""
Data models for the DAO Treasury Management system.
"""

from typing import List
from pydantic import BaseModel, Field, ConfigDict

class TreasuryBalance(BaseModel):
    """Treasury balance information"""
    token_address: str = Field(description="The address of the token")
    token_name: str = Field(description="The name of the token")
    token_symbol: str = Field(description="The symbol of the token")
    balance: int = Field(description="The raw balance in wei")
    balance_formatted: float = Field(description="The formatted balance in token units")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "token_address": "0x1234...",
                "token_name": "Ethereum",
                "token_symbol": "ETH",
                "balance": 1000000000000000000,
                "balance_formatted": 1.0
            }
        }
    )

class StrategyMetrics(BaseModel):
    """Strategy metrics information"""
    strategy_id: int = Field(description="The ID of the strategy")
    apy: int = Field(description="Annual Percentage Yield in basis points")
    tvl: int = Field(description="Total Value Locked in wei")
    utilization_rate: int = Field(description="Utilization rate in basis points")
    risk_adjusted_returns: int = Field(description="Risk-adjusted returns in basis points")
    withdrawal_liquidity: int = Field(description="Withdrawal liquidity in basis points")
    description: str = Field(description="Strategy description")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "strategy_id": 1,
                "apy": 720,
                "tvl": 450000000000000000000000,
                "utilization_rate": 8500,
                "risk_adjusted_returns": 180,
                "withdrawal_liquidity": 8500,
                "description": "Aave-like lending protocol strategy"
            }
        }
    )

class TreasuryData(BaseModel):
    """Treasury data information"""
    treasury_address: str = Field(description="The address of the treasury contract")
    eth_balance: int = Field(description="ETH balance in wei")
    eth_token_balance: int = Field(description="ETH token balance in wei")
    eth_token_symbol: str = Field(description="ETH token symbol")
    total_value_usd: float = Field(description="Total value in USD")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "treasury_address": "0x1234...",
                "eth_balance": 1000000000000000000,
                "eth_token_balance": 2000000000000000000,
                "eth_token_symbol": "ETH",
                "total_value_usd": 2000.0
            }
        }
    )

class StrategyAnalysis(BaseModel):
    """Strategy analysis information"""
    strategies: List[StrategyMetrics] = Field(description="List of available strategies")
    best_strategy: StrategyMetrics = Field(description="The recommended strategy")
    reasoning: str = Field(description="Reasoning for the strategy selection")
    expected_profit: float = Field(description="Expected profit in USD")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "strategies": [
                    {
                        "strategy_id": 1,
                        "apy": 720,
                        "tvl": 450000000000000000000000,
                        "utilization_rate": 8500,
                        "risk_adjusted_returns": 180,
                        "withdrawal_liquidity": 8500,
                        "description": "Aave-like lending protocol strategy"
                    }
                ],
                "best_strategy": {
                    "strategy_id": 1,
                    "apy": 720,
                    "tvl": 450000000000000000000000,
                    "utilization_rate": 8500,
                    "risk_adjusted_returns": 180,
                    "withdrawal_liquidity": 8500,
                    "description": "Aave-like lending protocol strategy"
                },
                "reasoning": "Selected based on optimal risk-adjusted returns",
                "expected_profit": 1000.0
            }
        }
    )

class GovernanceProposal(BaseModel):
    """Governance proposal information"""
    description: str = Field(description="Proposal description")
    targets: List[str] = Field(description="List of target contract addresses")
    values: List[int] = Field(description="List of ETH values to send")
    calldatas: List[bytes] = Field(description="List of encoded function calls")
    reasoning: str = Field(description="Reasoning for the proposal")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "description": "Execute Strategy 1 through Treasury",
                "targets": ["0x1234..."],
                "values": [0],
                "calldatas": ["0x..."],
                "reasoning": "Strategy 1 selected based on optimal risk-adjusted returns"
            }
        }
    ) 