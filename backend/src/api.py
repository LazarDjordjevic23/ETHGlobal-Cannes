"""
FastAPI application for the DAO Treasury Management system.
"""

from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from web3 import Web3

from .config import (
    RPC_URL, PRIVATE_KEY, TREASURY_ADDRESS,
    STRATEGY_ADDRESS, GOVERNANCE_ADDRESS, ETHToken_ADDRESS
)
from .services.treasury import TreasuryService
from .services.strategy import StrategyService
from .services.governance import GovernanceService
from .crew import ProposalCrew

# Constants
SEPOLIA_EXPLORER_URL = "https://sepolia.etherscan.io/tx/"

app = FastAPI(
    title="DAO Treasury Management API",
    description="API for managing DAO treasury and creating governance proposals",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class TreasuryDataModel(BaseModel):
    """Treasury data model"""
    eth_balance: str = Field(description="ETH balance in wei")
    eth_token_balance: str = Field(description="ETH token balance in wei")
    total_value_usd: float = Field(description="Total value in USD")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "eth_balance": "1000000000000000000",
                "eth_token_balance": "2000000000000000000",
                "total_value_usd": 2000.0
            }
        }
    )

class StrategyMetricsModel(BaseModel):
    """Strategy metrics model"""
    apy: str = Field(description="Annual Percentage Yield")
    tvl: str = Field(description="Total Value Locked")
    risk_adjusted_returns: str = Field(description="Risk-adjusted returns")
    withdrawal_liquidity: str = Field(description="Withdrawal liquidity")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "apy": "720",
                "tvl": "450000000000000000000000",
                "risk_adjusted_returns": "180",
                "withdrawal_liquidity": "8500"
            }
        }
    )

class StrategyRecommendationModel(BaseModel):
    """Strategy recommendation model"""
    strategy_id: int = Field(description="The ID of the recommended strategy")
    reasoning: str = Field(description="Reasoning for the strategy selection")
    expected_profit: str = Field(description="Expected profit")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "strategy_id": 1,
                "reasoning": "Selected based on optimal risk-adjusted returns",
                "expected_profit": "100000"
            }
        }
    )

class AIAnalysisModel(BaseModel):
    """AI analysis model"""
    final_output: str = Field(description="Complete analysis output")
    strategy_recommendation: StrategyRecommendationModel = Field(description="Strategy recommendation")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "final_output": "Complete analysis...",
                "strategy_recommendation": {
                    "strategy_id": 1,
                    "reasoning": "Detailed reasoning...",
                    "expected_profit": "100000"
                }
            }
        }
    )

class ProposalResponse(BaseModel):
    """Response model for proposal creation"""
    timestamp: str = Field(description="Timestamp of the proposal creation")
    tx_hash: Optional[str] = Field(None, description="Transaction hash if proposal was submitted")
    tx_url: Optional[str] = Field(None, description="Etherscan URL for the transaction")
    strategy_id: int = Field(description="The ID of the selected strategy")
    expected_apy: float = Field(description="Expected Annual Percentage Yield")
    reasoning: str = Field(description="Reasoning for the strategy selection")
    treasury_data: TreasuryDataModel = Field(description="Current treasury data")
    strategy_metrics: StrategyMetricsModel = Field(description="Selected strategy metrics")
    ai_analysis: AIAnalysisModel = Field(description="AI analysis results")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "timestamp": "2024-03-15T12:00:00",
                "tx_hash": "0x123...",
                "tx_url": "https://sepolia.etherscan.io/tx/0x123...",
                "strategy_id": 1,
                "expected_apy": 7.2,
                "reasoning": "Strategy selected based on optimal risk-adjusted returns",
                "treasury_data": {
                    "eth_balance": "1000000000000000000",
                    "eth_token_balance": "1000000000000000000",
                    "total_value_usd": 2000.0
                },
                "strategy_metrics": {
                    "apy": "720",
                    "tvl": "450000000000000000000000",
                    "risk_adjusted_returns": "180",
                    "withdrawal_liquidity": "8500"
                },
                "ai_analysis": {
                    "final_output": "Complete analysis...",
                    "strategy_recommendation": {
                        "strategy_id": 1,
                        "reasoning": "Detailed reasoning...",
                        "expected_profit": "100000"
                    }
                }
            }
        }
    )

class ServiceStatus(BaseModel):
    """Service health status"""
    name: str = Field(description="Service name")
    status: str = Field(description="Service status (healthy/unhealthy/configured/unconfigured)")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional service details")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "web3",
                "status": "healthy",
                "details": {
                    "connected": True,
                    "network": 11155111,
                    "block_number": 12345678
                }
            }
        }
    )

class StatusResponse(BaseModel):
    """API status response"""
    api_version: str = Field(description="API version")
    services: list[ServiceStatus] = Field(description="List of service statuses")
    config: Dict[str, Any] = Field(description="Current configuration")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "api_version": "1.0.0",
                "services": [
                    {
                        "name": "web3",
                        "status": "healthy",
                        "details": {
                            "network": "sepolia",
                            "block_number": 12345678
                        }
                    }
                ],
                "config": {
                    "treasury_address": "0x...",
                    "strategy_address": "0x...",
                    "governance_address": "0x..."
                }
            }
        }
    )

@app.post("/propose", response_model=ProposalResponse)
async def create_proposal():
    """
    Create a new governance proposal using AI analysis.
    
    The endpoint will:
    1. Analyze current treasury state
    2. Evaluate available strategies
    3. Create and submit a governance proposal
    
    Returns:
        ProposalResponse: The proposal details and analysis results
    """
    try:
        # Initialize services
        treasury_service = TreasuryService(RPC_URL)
        strategy_service = StrategyService(RPC_URL)
        governance_service = GovernanceService(RPC_URL, PRIVATE_KEY) if PRIVATE_KEY else None
        
        # Create and run the crew
        crew = ProposalCrew(
            treasury_service=treasury_service,
            strategy_service=strategy_service,
            governance_service=governance_service,
            treasury_address=TREASURY_ADDRESS,
            strategy_address=STRATEGY_ADDRESS,
            governance_address=GOVERNANCE_ADDRESS,
            eth_token_address=ETHToken_ADDRESS
        )
        
        # Run the analysis
        result = crew.run_analysis()
        
        # Add Etherscan link if we have a transaction hash
        if result.get('tx_hash'):
            result['tx_url'] = f"{SEPOLIA_EXPLORER_URL}{result['tx_hash']}"
        else:
            result['tx_url'] = None
            
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create proposal: {str(e)}"
        )

@app.get("/status", response_model=StatusResponse)
async def get_status():
    """
    Get the current status of the API and its services.
    
    Returns:
        StatusResponse: The current status of all services and configuration
    """
    try:
        services = []
        
        # Check Web3 connection
        w3 = Web3(Web3.HTTPProvider(RPC_URL))
        web3_status = {
            "name": "web3",
            "status": "healthy" if w3.is_connected() else "unhealthy",
            "details": {
                "connected": w3.is_connected(),
                "network": w3.eth.chain_id,
                "block_number": w3.eth.block_number if w3.is_connected() else None
            }
        }
        services.append(ServiceStatus(**web3_status))
        
        # Check Treasury contract
        try:
            treasury_service = TreasuryService(RPC_URL)
            treasury_data = treasury_service.get_treasury_data(TREASURY_ADDRESS, ETHToken_ADDRESS)
            treasury_status = {
                "name": "treasury",
                "status": "healthy",
                "details": {
                    "eth_balance": str(treasury_data.eth_balance),
                    "eth_token_balance": str(treasury_data.eth_token_balance)
                }
            }
        except Exception as e:
            treasury_status = {
                "name": "treasury",
                "status": "unhealthy",
                "details": {"error": str(e)}
            }
        services.append(ServiceStatus(**treasury_status))
        
        # Check Strategy contract
        try:
            strategy_service = StrategyService(RPC_URL)
            strategies = strategy_service.get_all_strategies(STRATEGY_ADDRESS)
            strategy_status = {
                "name": "strategy",
                "status": "healthy",
                "details": {
                    "strategies_count": len(strategies),
                    "strategies": [
                        {
                            "id": s.strategy_id,
                            "apy": s.apy,
                            "tvl": str(s.tvl)
                        } for s in strategies
                    ]
                }
            }
        except Exception as e:
            strategy_status = {
                "name": "strategy",
                "status": "unhealthy",
                "details": {"error": str(e)}
            }
        services.append(ServiceStatus(**strategy_status))
        
        # Check Governance setup
        governance_status = {
            "name": "governance",
            "status": "configured" if PRIVATE_KEY else "unconfigured",
            "details": {
                "has_private_key": bool(PRIVATE_KEY),
                "address": GOVERNANCE_ADDRESS
            }
        }
        services.append(ServiceStatus(**governance_status))
        
        # Prepare configuration status (hide sensitive data)
        config = {
            "rpc_url": RPC_URL,
            "treasury_address": TREASURY_ADDRESS,
            "strategy_address": STRATEGY_ADDRESS,
            "governance_address": GOVERNANCE_ADDRESS,
            "eth_token_address": ETHToken_ADDRESS,
            "has_private_key": bool(PRIVATE_KEY)
        }
        
        return StatusResponse(
            api_version="1.0.0",
            services=services,
            config=config
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get status: {str(e)}"
        ) 