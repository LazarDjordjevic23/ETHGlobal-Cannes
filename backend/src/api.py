"""
FastAPI application for the DAO Treasury Management system.
"""

from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from web3 import Web3

import os
from .config import (
    PRIVATE_KEY, TREASURY_ADDRESS,
    STRATEGY_ADDRESS, GOVERNANCE_ADDRESS, ETHToken_ADDRESS
)
from .services.treasury import TreasuryService
from .services.strategy import StrategyService
from .services.governance import GovernanceService
from .crew import ProposalCrew

# Removed SEPOLIA_EXPLORER_URL - now using chain-specific explorer URLs

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

# Chain configuration mapping with default RPC URLs
CHAIN_CONFIGS = {
    "ethereum": {
        "default_rpc_url": "https://ethereum-sepolia-rpc.publicnode.com",
        "explorer_url": "https://sepolia.etherscan.io/tx/",
        "env_var": "SEPOLIA_RPC_URL"
    },
    "zuircuit": {
        "default_rpc_url": "https://zircuit-garfield-testnet.drpc.org",
        "explorer_url": "https://explorer.testnet.zircuit.com/tx/",
        "env_var": "ZUIRCUIT_RPC_URL"
    },
    "flow": {
        "default_rpc_url": "https://testnet.evm.nodes.onflow.org",
        "explorer_url": "https://evm-testnet.flowscan.io/tx/",
        "env_var": "FLOW_RPC_URL"
    }
}

def get_rpc_url(chain: str) -> str:
    """Get RPC URL for the specified chain"""
    if chain not in CHAIN_CONFIGS:
        raise ValueError(f"Unsupported chain: {chain}. Supported chains: {list(CHAIN_CONFIGS.keys())}")
    
    chain_config = CHAIN_CONFIGS[chain]
    
    # Override RPC URL with environment variable if available
    rpc_url = os.getenv(chain_config["env_var"])
    
    # Fallback to existing ETHEREUM_RPC_URL for ethereum (backward compatibility)
    if not rpc_url and chain == "ethereum":
        rpc_url = os.getenv("ETHEREUM_RPC_URL")
    
    # Use default RPC URL if no environment override
    if not rpc_url:
        rpc_url = chain_config["default_rpc_url"]
    
    return rpc_url

# Removed TreasuryDataModel and StrategyMetricsModel as they're no longer used in the simplified response

class StrategyRecommendationModel(BaseModel):
    """Strategy recommendation model"""
    strategy_id: int = Field(description="The ID of the recommended strategy")
    reasoning: str = Field(description="Reasoning for the strategy selection")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "strategy_id": 1,
                "reasoning": "Selected based on optimal risk-adjusted returns"
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
                    "reasoning": "Detailed reasoning..."
                }
            }
        }
    )

class ProposalResponse(BaseModel):
    """Response model for proposal creation"""
    timestamp: str = Field(description="Timestamp of the proposal creation")
    tx_url: Optional[str] = Field(None, description="Chain-specific explorer URL for the transaction")
    strategy_id: int = Field(description="The ID of the selected strategy")
    reasoning: str = Field(description="Detailed reasoning for the strategy selection")
    description: str = Field(description="Hardcoded description: 'Investing strategy'")
    ai_analysis: AIAnalysisModel = Field(description="AI analysis results")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "timestamp": "2024-03-15T12:00:00",
                "tx_url": "https://sepolia.etherscan.io/tx/0x9e01cb1a09bb6687518611571bb67e24fb8f995586aeca28cc741383afb33390",
                "strategy_id": 3,
                "reasoning": "Treasury health: poor, risk tolerance: conservative, market conditions: bearish. Strategy 3 selected due to high withdrawal liquidity and balanced approach suitable for current conditions.",
                "description": "Investing strategy",
                "ai_analysis": {
                    "final_output": "Complete analysis...",
                    "strategy_recommendation": {
                        "strategy_id": 3,
                        "reasoning": "Detailed reasoning..."
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
async def create_proposal(chain: str = Query("ethereum", description="EVM chain to use", enum=["ethereum", "zuircuit", "flow"])):
    """
    Create a new governance proposal using AI analysis.
    
    The endpoint will:
    1. Analyze current treasury state
    2. Evaluate available strategies
    3. Create and submit a governance proposal
    
    Supports multiple EVM chains through the chain parameter:
    - ethereum: Ethereum Sepolia testnet
    - zuircuit: Zircuit testnet
    - flow: Flow EVM testnet
    
    RPC URL Override via Environment Variables:
    - SEPOLIA_RPC_URL: Override Ethereum (Sepolia) testnet RPC URL
    - ZUIRCUIT_RPC_URL: Override Zircuit testnet RPC URL
    - FLOW_RPC_URL: Override Flow testnet RPC URL
    - ETHEREUM_RPC_URL: Fallback for Ethereum chain (backward compatibility)
    
    Args:
        chain: EVM chain to use (ethereum, zuircuit, flow). Defaults to ethereum.
    
    Returns:
        ProposalResponse: The proposal details and analysis results with chain-specific explorer URL
    """
    try:
        # Get chain-specific configuration
        rpc_url = get_rpc_url(chain)
        
        # Log which RPC URL is being used for debugging
        print(f"🌐 Using RPC URL for {chain}: {rpc_url}")
        
        # Initialize services with chain-specific RPC URL
        treasury_service = TreasuryService(rpc_url)
        strategy_service = StrategyService(rpc_url)
        governance_service = GovernanceService(rpc_url, PRIVATE_KEY) if PRIVATE_KEY else None
        
        # Create and run the crew
        crew = ProposalCrew(
            treasury_service=treasury_service,
            strategy_service=strategy_service,
            governance_service=governance_service,
            treasury_address=TREASURY_ADDRESS,
            strategy_address=STRATEGY_ADDRESS,
            governance_address=GOVERNANCE_ADDRESS,
            eth_token_address=ETHToken_ADDRESS,
            explorer_url=CHAIN_CONFIGS[chain]["explorer_url"]
        )
        
        # Run the analysis
        result = crew.run_analysis()
            
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create proposal: {str(e)}"
        )

@app.get("/status", response_model=StatusResponse)
async def get_status(chain: str = Query("ethereum", description="EVM chain to check status for", enum=["ethereum", "zuircuit", "flow"])):
    """
    Get the current status of the API and its services for a specific chain.
    
    Supports multiple EVM chains through the chain parameter:
    - ethereum: Ethereum Sepolia testnet
    - zuircuit: Zircuit testnet
    - flow: Flow EVM testnet
    
    Args:
        chain: EVM chain to check status for (ethereum, zuircuit, flow). Defaults to ethereum.
    
    Returns:
        StatusResponse: The current status of all services and configuration for the specified chain
    """
    try:
        # Get RPC URL for the specified chain
        rpc_url = get_rpc_url(chain)
        
        services = []
        
        # Check Web3 connection
        w3 = Web3(Web3.HTTPProvider(rpc_url))
        web3_status = {
            "name": "web3",
            "status": "healthy" if w3.is_connected() else "unhealthy",
            "details": {
                "connected": w3.is_connected(),
                "network": w3.eth.chain_id,
                "block_number": w3.eth.block_number if w3.is_connected() else None,
                "chain": chain,
                "rpc_url": rpc_url
            }
        }
        services.append(ServiceStatus(**web3_status))
        
        # Check Treasury contract
        try:
            treasury_service = TreasuryService(rpc_url)
            treasury_data = treasury_service.get_treasury_data(TREASURY_ADDRESS, ETHToken_ADDRESS)
            treasury_status = {
                "name": "treasury",
                "status": "healthy",
                "details": {
                    "eth_balance": str(treasury_data.eth_balance),
                    "eth_token_balance": str(treasury_data.eth_token_balance),
                    "chain": chain
                }
            }
        except Exception as e:
            treasury_status = {
                "name": "treasury",
                "status": "unhealthy",
                "details": {"error": str(e), "chain": chain}
            }
        services.append(ServiceStatus(**treasury_status))
        
        # Check Strategy contract
        try:
            strategy_service = StrategyService(rpc_url)
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
                    ],
                    "chain": chain
                }
            }
        except Exception as e:
            strategy_status = {
                "name": "strategy",
                "status": "unhealthy",
                "details": {"error": str(e), "chain": chain}
            }
        services.append(ServiceStatus(**strategy_status))
        
        # Check Governance setup
        governance_status = {
            "name": "governance",
            "status": "configured" if PRIVATE_KEY else "unconfigured",
            "details": {
                "has_private_key": bool(PRIVATE_KEY),
                "address": GOVERNANCE_ADDRESS,
                "chain": chain
            }
        }
        services.append(ServiceStatus(**governance_status))
        
        # Prepare configuration status (hide sensitive data)
        config = {
            "rpc_url": rpc_url,
            "treasury_address": TREASURY_ADDRESS,
            "strategy_address": STRATEGY_ADDRESS,
            "governance_address": GOVERNANCE_ADDRESS,
            "eth_token_address": ETHToken_ADDRESS,
            "has_private_key": bool(PRIVATE_KEY),
            "chain": chain,
            "explorer_url": CHAIN_CONFIGS[chain]["explorer_url"]
        }
        
        return StatusResponse(
            api_version="1.0.0",
            services=services,
            config=config
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get status for chain {chain}: {str(e)}"
        ) 