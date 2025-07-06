"""
Configuration settings for the DAO Treasury Management system.
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Support both AI_AGENT_PRIVATE_KEY and PRIVATE_KEY environment variables
# for backward compatibility and documentation consistency
PRIVATE_KEY = os.getenv("AI_AGENT_PRIVATE_KEY") or os.getenv("PRIVATE_KEY", "")

# If private key starts with '0x', remove it
if PRIVATE_KEY.startswith('0x'):
    PRIVATE_KEY = PRIVATE_KEY[2:]

def get_contract_addresses_for_chain(chain: str) -> dict:
    """Get contract addresses for the specified chain"""
    
    # Chain-specific environment variable mappings
    chain_contract_mapping = {
        "ethereum": {
            "treasury": ["ETHEREUM_TREASURY_ADDRESS"],
            "strategy": ["ETHEREUM_STRATEGY_ADDRESS"],
            "governance": ["ETHEREUM_GOVERNANCE_ADDRESS"],
            "eth_token": ["ETHEREUM_ETH_TOKEN_ADDRESS"]
        },
        "zircuit": {
            "treasury": ["ZIRCUIT_TREASURY_ADDRESS"],
            "strategy": ["ZIRCUIT_STRATEGY_ADDRESS"],
            "governance": ["ZIRCUIT_GOVERNANCE_ADDRESS"],
            "eth_token": ["ZIRCUIT_ETH_TOKEN_ADDRESS"]
        },
        "flow": {
            "treasury": ["FLOW_TREASURY_ADDRESS"],
            "strategy": ["FLOW_STRATEGY_ADDRESS"],
            "governance": ["FLOW_GOVERNANCE_ADDRESS"],
            "eth_token": ["FLOW_ETH_TOKEN_ADDRESS"]
        },
        "mantle": {
            "treasury": ["MANTLE_TREASURY_ADDRESS"],
            "strategy": ["MANTLE_STRATEGY_ADDRESS"],
            "governance": ["MANTLE_GOVERNANCE_ADDRESS"],
            "eth_token": ["MANTLE_ETH_TOKEN_ADDRESS"]
        }
    }
    
    if chain not in chain_contract_mapping:
        raise ValueError(f"Unsupported chain: {chain}")
    
    def get_address_for_contract(contract_type: str) -> str:
        """Get address for a specific contract type, trying chain-specific first"""
        env_vars = chain_contract_mapping[chain][contract_type]
        for env_var in env_vars:
            address = os.getenv(env_var)
            if address:
                return address
        return "0x0000000000000000000000000000000000000000"
    
    return {
        "treasury": get_address_for_contract("treasury"),
        "strategy": get_address_for_contract("strategy"),
        "governance": get_address_for_contract("governance"),
        "eth_token": get_address_for_contract("eth_token")
    }

def get_llm():
    """Get the LLM configuration"""
    from langchain_openai import ChatOpenAI
    
    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("CHAT_GPT_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is required")
    
    # Set environment variable for langchain
    os.environ["OPENAI_API_KEY"] = api_key
    
    return ChatOpenAI(
        model="gpt-4-turbo-preview",
        temperature=0.1
    ) 