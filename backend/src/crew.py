"""
CrewAI implementation for strategy analysis and proposal creation.
"""

import json
from datetime import datetime
from typing import Optional, Dict, Any
from web3 import Web3
from crewai import Agent, Task, Crew, Process
from crewai_tools import FileReadTool

from .config import get_llm
from .models import GovernanceProposal
from .services.treasury import TreasuryService
from .services.strategy import StrategyService
from .services.governance import GovernanceService
from .utils import create_proposal_parameters

# Constants
SEPOLIA_EXPLORER_URL = "https://sepolia.etherscan.io/tx/"

class ProposalCrew:
    """Crew for analyzing strategies and creating proposals"""
    
    def __init__(
        self,
        treasury_service: TreasuryService,
        strategy_service: StrategyService,
        governance_service: Optional[GovernanceService] = None,
        treasury_address: str = "",
        strategy_address: str = "",
        governance_address: str = "",
        eth_token_address: str = ""
    ):
        self.treasury_service = treasury_service
        self.strategy_service = strategy_service
        self.governance_service = governance_service
        self.treasury_address = treasury_address
        self.strategy_address = strategy_address
        self.governance_address = governance_address
        self.eth_token_address = eth_token_address
        
        # Get LLM
        self.llm = get_llm()
    
    def _create_agents(self) -> tuple[Agent, Agent, Agent]:
        """Create the three agents needed for the crew"""
        treasury_agent = Agent(
            role="Treasury Analyst",
            goal="Analyze current treasury balances and financial position",
            backstory="""You are an expert treasury analyst with deep knowledge of DeFi protocols and 
            financial risk management. You specialize in analyzing treasury positions and understanding 
            the current financial state of DAOs.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm,
            tools=[FileReadTool()]
        )
        
        strategy_agent = Agent(
            role="Strategy Evaluator",
            goal="Evaluate available investment strategies and their risk-return profiles",
            backstory="""You are a DeFi strategy expert with years of experience in yield farming, 
            liquidity provision, and risk assessment. You understand the nuances of different 
            investment strategies and can evaluate their suitability based on market conditions 
            and treasury requirements.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm,
            tools=[FileReadTool()]
        )
        
        proposal_agent = Agent(
            role="Governance Proposal Creator",
            goal="Create optimal governance proposals based on treasury analysis and strategy evaluation",
            backstory="""You are a governance expert who creates clear, actionable proposals for DAOs. 
            You understand the technical requirements of governance systems and can translate 
            strategic decisions into executable proposals. You always provide clear reasoning 
            for your recommendations.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm,
            tools=[FileReadTool()]
        )
        
        return treasury_agent, strategy_agent, proposal_agent
    
    def _create_tasks(self, treasury_info: str, strategy_info: str, agents: tuple[Agent, Agent, Agent]) -> list[Task]:
        """Create the tasks for the crew"""
        treasury_agent, strategy_agent, proposal_agent = agents
        
        treasury_task = Task(
            description=f"""
            Analyze the current treasury position and provide insights on:
            1. Current financial health of the treasury
            2. Available capital for investment
            3. Risk tolerance considerations
            4. Market conditions impact
            
            Treasury Data:
            {treasury_info}
            
            Provide a comprehensive analysis in JSON format with the following structure:
            {{
                "treasury_health": "excellent/good/fair/poor",
                "available_capital": "amount in USD",
                "risk_tolerance": "conservative/moderate/aggressive",
                "market_conditions": "bullish/bearish/neutral",
                "analysis_summary": "detailed analysis text"
            }}
            """,
            agent=treasury_agent,
            expected_output="JSON analysis of treasury position"
        )
        
        strategy_task = Task(
            description=f"""
            Evaluate all available strategies and recommend the best one based on:
            1. Risk-adjusted returns
            2. Liquidity requirements
            3. Market conditions
            4. Treasury risk tolerance
            
            Available Strategies:
            {strategy_info}
            
            Provide a comprehensive evaluation in JSON format with the following structure:
            {{
                "recommended_strategy": "strategy_id (1, 2, or 3)",
                "reasoning": "detailed explanation of why this strategy is best",
                "expected_apy": "percentage",
                "risk_level": "low/medium/high",
                "liquidity_considerations": "text about withdrawal liquidity",
                "alternative_strategies": "list of other strategies considered"
            }}
            """,
            agent=strategy_agent,
            expected_output="JSON evaluation of strategies with recommendation"
        )
        
        proposal_task = Task(
            description=f"""
            Create a governance proposal based on the treasury analysis and strategy recommendation.
            
            The proposal should call the Treasury contract's execute function to execute the chosen strategy.
            
            Use the treasury analysis and strategy evaluation to create a proposal that:
            1. Clearly explains the rationale for the chosen strategy
            2. Provides expected outcomes and risks
            3. Includes all necessary technical details for execution
            
            The proposal should be in JSON format with the following structure:
            {{
                "proposal_title": "title",
                "proposal_description": "detailed description for governance proposal",
                "strategy_id": "chosen strategy id (1, 2, or 3)",
                "expected_profit": "estimated profit in USD",
                "risk_assessment": "risk analysis",
                "execution_details": "technical details for execution",
                "reasoning": "detailed explanation of why this strategy is best"
            }}
            
            IMPORTANT: The governance proposal will call Treasury.execute() which will then call the strategy contract.
            """,
            agent=proposal_agent,
            context=[treasury_task, strategy_task],
            expected_output="JSON governance proposal"
        )
        
        return [treasury_task, strategy_task, proposal_task]
    
    def run_analysis(self) -> Dict[str, Any]:
        """Run the crew analysis and return the results"""
        print("🤖 CAPITALIST CREW - AI-Driven Treasury Management")
        print("=" * 60)
        
        try:
            # Get treasury data
            print("📊 TREASURY AGENT: Analyzing treasury balances...")
            treasury_data = self.treasury_service.get_treasury_data(self.treasury_address, self.eth_token_address)
            
            # Get strategy data
            print("📈 STRATEGY AGENT: Analyzing available strategies...")
            strategies = self.strategy_service.get_all_strategies(self.strategy_address)
            
            # Prepare data for agents
            treasury_info = f"""
            Treasury Analysis:
            - Treasury Address: {treasury_data.treasury_address}
            - ETH Balance: {treasury_data.eth_balance / 1e18:.4f} ETH
            - {treasury_data.eth_token_symbol} Balance: {treasury_data.eth_token_balance / 1e18:.2f}
            - Total Value USD: ${treasury_data.total_value_usd:,.2f}
            """
            
            strategy_info = "Available Strategies:\n"
            for strategy in strategies:
                strategy_info += f"""
                Strategy {strategy.strategy_id}:
                - APY: {strategy.apy / 100:.2f}%
                - TVL: ${strategy.tvl / 1e18:,.0f}
                - Utilization Rate: {strategy.utilization_rate / 100:.2f}%
                - Risk-Adjusted Returns: {strategy.risk_adjusted_returns / 100:.2f}
                - Withdrawal Liquidity: {strategy.withdrawal_liquidity / 100:.2f}%
                - Description: {strategy.description}
                """
            
            # Create and run the crew
            agents = self._create_agents()
            tasks = self._create_tasks(treasury_info, strategy_info, agents)
            
            crew = Crew(
                agents=list(agents),
                tasks=tasks,
                verbose=True,
                process=Process.sequential
            )
            
            print("🚀 Starting AI Crew Analysis...")
            result = crew.kickoff()
            
            # Parse the results
            result_str = str(result)
            json_match = result_str.find('{')
            if json_match != -1:
                proposal_data = json.loads(result_str[json_match:])
                
                # Get the recommended strategy
                recommended_strategy_id = int(proposal_data.get("strategy_id", 1))
                recommended_strategy = next(s for s in strategies if s.strategy_id == recommended_strategy_id)
                
                # Create proposal parameters
                targets, values, calldatas, description = create_proposal_parameters(
                    self.treasury_address,
                    self.strategy_address,
                    self.eth_token_address
                )
                
                # Create the governance proposal
                proposal = GovernanceProposal(
                    description=proposal_data.get("proposal_description", description),
                    targets=targets,
                    values=values,
                    calldatas=calldatas,
                    reasoning=proposal_data.get("reasoning", f"Strategy {recommended_strategy_id} selected by AI analysis")
                )
                
                # Submit proposal if governance service is available
                tx_hash = None
                if self.governance_service:
                    print("\n📝 GOVERNANCE: Submitting proposal to blockchain...")
                    tx_hash = self.governance_service.create_proposal(self.governance_address, proposal)
                    if tx_hash:
                        print(f"✅ Proposal submitted successfully!")
                        print(f"📊 Transaction Hash: {tx_hash}")
                        print(f"🔍 View on Etherscan: {SEPOLIA_EXPLORER_URL}{tx_hash}")
                    else:
                        print("❌ Failed to submit proposal to blockchain")
                else:
                    print("⚠️ No governance service available - skipping blockchain submission")
                
                # Create the response
                response = {
                    "timestamp": datetime.utcnow().isoformat(),
                    "tx_hash": tx_hash,
                    "tx_url": f"{SEPOLIA_EXPLORER_URL}{tx_hash}" if tx_hash else None,
                    "strategy_id": recommended_strategy_id,
                    "expected_apy": recommended_strategy.apy / 100,
                    "reasoning": proposal.reasoning,
                    "treasury_data": {
                        "eth_balance": str(treasury_data.eth_balance),
                        "eth_token_balance": str(treasury_data.eth_token_balance),
                        "total_value_usd": treasury_data.total_value_usd
                    },
                    "strategy_metrics": {
                        "apy": str(recommended_strategy.apy),
                        "tvl": str(recommended_strategy.tvl),
                        "risk_adjusted_returns": str(recommended_strategy.risk_adjusted_returns),
                        "withdrawal_liquidity": str(recommended_strategy.withdrawal_liquidity)
                    },
                    "ai_analysis": {
                        "final_output": str(result),
                        "strategy_recommendation": {
                            "strategy_id": recommended_strategy_id,
                            "reasoning": proposal.reasoning,
                            "expected_profit": str(treasury_data.total_value_usd)
                        }
                    }
                }
                
                return response
                
            else:
                raise ValueError("Could not parse AI analysis results")
                
        except Exception as e:
            print(f"❌ Error in crew analysis: {str(e)}")
            raise 