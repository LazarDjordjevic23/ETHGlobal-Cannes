"""
Tool for creating governance proposals using the governance service.
"""

import json
from typing import Optional, Dict, Any
from pydantic import Field, ConfigDict
from crewai.tools import BaseTool
from ..models import GovernanceProposal
from ..services.governance import GovernanceService
from ..utils import create_proposal_parameters

class ProposalTool(BaseTool):
    """Tool for creating governance proposals"""
    
    name: str = "proposal_tool"
    description: str = """
    Creates a governance proposal based on the provided parameters.
    
    Input should be a JSON string with the following structure:
    {
        "proposal_title": "title",
        "proposal_description": "Investing strategy",
        "strategy_id": "chosen strategy id (1, 2, or 3)",
        "expected_profit": "estimated profit in USD",
        "risk_assessment": "risk analysis",
        "execution_details": "technical details",
        "reasoning": "detailed explanation"
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
            # Handle both string and dictionary inputs
            if isinstance(tool_input, str):
                try:
                    input_json: Dict[str, Any] = json.loads(tool_input)
                except json.JSONDecodeError:
                    # If it's not valid JSON, assume it's a simple string
                    input_json = {"reasoning": tool_input}
            elif isinstance(tool_input, dict):
                input_json = tool_input
            else:
                # Handle any other input type by converting to string
                input_json = {"reasoning": str(tool_input)}
            
            # Create proposal parameters
            targets, values, calldatas, _ = create_proposal_parameters(
                self.treasury_address,
                self.strategy_address,
                self.eth_token_address
            )
            
            # Get strategy ID
            strategy_id = input_json.get("strategy_id", "1")
            
            # Create the proposal object
            proposal = GovernanceProposal(
                description="Investing strategy",
                targets=targets,
                values=values,
                calldatas=calldatas,
                reasoning=input_json.get("reasoning", f"Strategy {strategy_id} selected based on AI analysis")
            )
            
            # Submit the proposal
            tx_hash = self.governance_service.create_proposal(
                self.governance_address,
                proposal
            )
            
            if tx_hash:
                return f"SUCCESS: Proposal submitted with transaction hash: {tx_hash}"
            else:
                return "ERROR: Failed to submit proposal - insufficient funds or network error"
            
        except Exception as e:
            return f"ERROR: {str(e)}" 