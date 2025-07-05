"""
Configuration settings for the DAO Treasury Management system.
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# RPC and Wallet Configuration
RPC_URL = os.getenv("ETHEREUM_RPC_URL", "https://sepolia.infura.io/v3/your-project-id")
PRIVATE_KEY = os.getenv("AI_AGENT_PRIVATE_KEY", "")

# Contract Addresses
TREASURY_ADDRESS = os.getenv("TREASURY_ADDRESS", "0x0000000000000000000000000000000000000000")
STRATEGY_ADDRESS = os.getenv("STRATEGY_ADDRESS", "0x0000000000000000000000000000000000000000")
GOVERNANCE_ADDRESS = os.getenv("GOVERNANCE_CONTRACT", "0x0000000000000000000000000000000000000000")
ETHToken_ADDRESS = os.getenv("ETH_TOKEN_ADDRESS", "0x0000000000000000000000000000000000000000")

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