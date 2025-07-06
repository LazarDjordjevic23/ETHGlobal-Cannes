"""
Tool for executing governance proposals using the governance service.
"""

import json
from typing import Optional, Dict, Any
from pydantic import Field, ConfigDict
from crewai.tools import BaseTool
from web3 import Web3
from ..services.governance import GovernanceService
from ..utils import create_proposal_parameters

class ExecuteProposalTool(BaseTool):
    """Tool for executing governance proposals"""
    
    name: str = "execute_proposal_tool"
    description: str = """
    Executes a governance proposal using the description hash.
    
    Input should be a JSON string with the following structure:
    {
        "strategy_id": "chosen strategy id (1, 2, or 3)",
        "reasoning": "detailed explanation for why this proposal should be executed"
    }
    """
    
    # Pydantic model configuration
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        validate_assignment=True
    )
    
    # Pydantic fields
    governance_service: GovernanceService = Field(...)
    treasury_address: str = Field(...)
    strategy_address: str = Field(...)
    governance_address: str = Field(...)
    eth_token_address: str = Field(...)
    
    def _run(self, tool_input: str) -> str:
        """Run the tool"""
        try:
            print(f"🔍 ExecuteProposalTool received input: {tool_input}")
            print(f"🔍 Input type: {type(tool_input)}")
            
            # Handle both string and dictionary inputs
            if isinstance(tool_input, str):
                try:
                    input_json: Dict[str, Any] = json.loads(tool_input)
                    print(f"🔍 Successfully parsed JSON: {input_json}")
                except json.JSONDecodeError as e:
                    print(f"🔍 JSON decode error: {e}")
                    # If it's not valid JSON, assume it's a simple string
                    input_json = {"reasoning": tool_input}
                    print(f"🔍 Using fallback input: {input_json}")
            elif isinstance(tool_input, dict):
                input_json = tool_input
                print(f"🔍 Using dict input: {input_json}")
            else:
                # Handle any other input type by converting to string
                input_json = {"reasoning": str(tool_input)}
                print(f"🔍 Using string conversion: {input_json}")
            
            # Validate required fields
            if not self.governance_service:
                return "ERROR: Governance service not initialized"
            if not self.treasury_address:
                return "ERROR: Treasury address not provided"
            if not self.strategy_address:
                return "ERROR: Strategy address not provided"
            if not self.governance_address:
                return "ERROR: Governance address not provided"
            if not self.eth_token_address:
                return "ERROR: ETH token address not provided"
            
            print(f"🔍 All required fields validated successfully")
            
            # Create the same proposal parameters as used in creation
            targets, values, calldatas, _ = create_proposal_parameters(
                self.treasury_address,
                self.strategy_address,
                self.eth_token_address
            )
            
            # Create the description hash from the exact same description used in proposal creation
            description = "Investing strategy"
            description_hash = Web3.keccak(text=description)
            
            print(f"🔍 Executing proposal with description: {description}")
            print(f"🔗 Description hash: {description_hash.hex()}")
            
            # Execute the proposal
            tx_hash = self.governance_service.execute_proposal(
                self.governance_address,
                targets,
                values,
                calldatas,
                description_hash
            )
            
            if tx_hash:
                return f"SUCCESS: Proposal executed with transaction hash: {tx_hash}"
            else:
                return "ERROR: Failed to execute proposal - insufficient funds or network error"
            
        except Exception as e:
            print(f"❌ Exception in ExecuteProposalTool: {str(e)}")
            import traceback
            traceback.print_exc()
            return f"ERROR: {str(e)}" 