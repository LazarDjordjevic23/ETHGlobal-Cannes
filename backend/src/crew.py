"""
CrewAI implementation for strategy analysis and proposal creation.
"""

import json
import os
from datetime import datetime, UTC
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
from .tools import ProposalTool, ExecuteProposalTool

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
        eth_token_address: str = "",
        explorer_url: str = SEPOLIA_EXPLORER_URL
    ):
        self.treasury_service = treasury_service
        self.strategy_service = strategy_service
        self.governance_service = governance_service
        self.treasury_address = treasury_address
        self.strategy_address = strategy_address
        self.governance_address = governance_address
        self.eth_token_address = eth_token_address
        self.explorer_url = explorer_url
        
        # Get LLM
        self.llm = get_llm()
        
        # Create proposal tool if governance service is available
        self.proposal_tool = None
        if self.governance_service:
            self.proposal_tool = ProposalTool(
                governance_service=self.governance_service,
                treasury_address=self.treasury_address,
                strategy_address=self.strategy_address,
                governance_address=self.governance_address,
                eth_token_address=self.eth_token_address
            )
    
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
            tools=[FileReadTool(), self.proposal_tool] if self.proposal_tool else [FileReadTool()]
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
            Create and submit a governance proposal based on the treasury analysis and strategy recommendation.
            
            Based on the treasury analysis and strategy evaluation:
            1. Choose the best strategy (1, 2, or 3) based on the analysis
            2. Create a detailed proposal explaining the rationale
            3. Use the proposal_tool to submit the proposal to the blockchain
            
            You must use the proposal_tool with a JSON string containing:
            {{
                "proposal_title": "title for the proposal",
                "proposal_description": ${os.getenv("DESCRIPTION")},
                "strategy_id": "chosen strategy id (1, 2, or 3)",
                "expected_profit": "estimated profit in USD",
                "risk_assessment": "risk analysis",
                "execution_details": "technical details for execution",
                "reasoning": "DETAILED explanation including: treasury health analysis, market conditions, strategy comparison, risk assessment, and why this specific strategy was selected over alternatives"
            }}
            
            IMPORTANT: 
            - The reasoning field must be comprehensive and explain the decision-making process
            - Include specific details about treasury health, market conditions, and strategy benefits
            - You MUST use the proposal_tool to actually submit the proposal. Do not just return JSON.
            """,
            agent=proposal_agent,
            context=[treasury_task, strategy_task],
            tools=[self.proposal_tool] if self.proposal_tool else None,
            expected_output="Result of proposal submission with transaction hash or error message"
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
            
            # Parse the results - the tool should have handled the proposal creation
            result_str = str(result)
            
            # Extract detailed task outputs from the crew result
            # The crew result contains outputs from all three agents
            tasks_outputs = []
            if hasattr(result, 'tasks_output') and result.tasks_output:
                for task_output in result.tasks_output:
                    tasks_outputs.append(str(task_output.raw))
            
            # Extract transaction hash from the result if present
            tx_hash = None
            if "SUCCESS: Proposal submitted with transaction hash:" in result_str:
                # Extract transaction hash from the success message
                import re
                hash_match = re.search(r'0x[a-fA-F0-9]{64}', result_str)
                if hash_match:
                    tx_hash = hash_match.group()
                    print(f"✅ Proposal submitted successfully!")
                    print(f"📊 Transaction Hash: {tx_hash}")
                    print(f"🔍 View on Explorer: {self.explorer_url}{tx_hash}")
            elif "ERROR:" in result_str:
                print("❌ Failed to submit proposal:")
                print(result_str)
            
            # Extract detailed reasoning from the AI analysis
            reasoning = "Strategy selection based on AI analysis"  # Default fallback
            recommended_strategy_id = 1  # Default fallback
            
            import re
            
            # First, extract strategy ID from any of the outputs
            all_content = result_str + " " + " ".join(tasks_outputs)
            strategy_match = re.search(r'strategy\s*(\d+)', all_content.lower())
            if strategy_match:
                recommended_strategy_id = int(strategy_match.group(1))
                if recommended_strategy_id not in [1, 2, 3]:
                    recommended_strategy_id = 1
            
            # Extract reasoning from individual task outputs (treasury and strategy analysis)
            treasury_analysis = ""
            strategy_analysis = ""
            
            if len(tasks_outputs) >= 2:
                # First task is treasury analysis
                treasury_output = tasks_outputs[0] if tasks_outputs else ""
                
                # Extract treasury insights
                treasury_patterns = [
                    r'"treasury_health"\s*:\s*"([^"]+)"',
                    r'"risk_tolerance"\s*:\s*"([^"]+)"', 
                    r'"market_conditions"\s*:\s*"([^"]+)"',
                    r'"analysis_summary"\s*:\s*"([^"]+)"'
                ]
                
                treasury_insights = []
                for pattern in treasury_patterns:
                    match = re.search(pattern, treasury_output)
                    if match:
                        treasury_insights.append(match.group(1))
                
                if treasury_insights:
                    treasury_analysis = f"Treasury health: {treasury_insights[0] if treasury_insights else 'assessed'}"
                    if len(treasury_insights) > 1:
                        treasury_analysis += f", risk tolerance: {treasury_insights[1]}"
                    if len(treasury_insights) > 2:
                        treasury_analysis += f", market conditions: {treasury_insights[2]}"
                
                # Second task is strategy analysis
                strategy_output = tasks_outputs[1] if len(tasks_outputs) > 1 else ""
                
                # Extract strategy insights
                strategy_patterns = [
                    r'"recommended_strategy"\s*:\s*"([^"]+)"',
                    r'"reasoning"\s*:\s*"([^"]+)"',
                    r'"risk_level"\s*:\s*"([^"]+)"',
                    r'"expected_apy"\s*:\s*"([^"]+)"'
                ]
                
                strategy_insights = []
                for pattern in strategy_patterns:
                    match = re.search(pattern, strategy_output)
                    if match:
                        strategy_insights.append(match.group(1))
                
                if strategy_insights:
                    if len(strategy_insights) > 1:
                        strategy_analysis = strategy_insights[1]  # Use the reasoning field
                    else:
                        strategy_analysis = f"Strategy {strategy_insights[0]} recommended"
                    
                    if len(strategy_insights) > 2:
                        strategy_analysis += f" with {strategy_insights[2]} risk level"
            
            # Combine treasury and strategy analysis for comprehensive reasoning
            reasoning_parts = []
            if treasury_analysis:
                reasoning_parts.append(treasury_analysis)
            if strategy_analysis and len(strategy_analysis) > 30:
                reasoning_parts.append(strategy_analysis)
            
            if reasoning_parts:
                reasoning = ". ".join(reasoning_parts)
                if not reasoning.endswith('.'):
                    reasoning += '.'
            
            # Fallback: extract any substantial reasoning from the outputs
            if len(reasoning) < 80:
                # Look for substantial sentences that explain the decision
                all_outputs_text = " ".join(tasks_outputs)
                
                # Extract sentences that contain key reasoning words
                reasoning_sentences = re.findall(
                    r'[A-Z][^\.]*(?:because|due to|given|selected|recommended|chosen|analysis|assessment)[^\.]*\.',
                    all_outputs_text
                )
                
                # Filter out tool-related sentences
                filtered_sentences = [
                    sentence.strip() for sentence in reasoning_sentences
                    if not any(word in sentence.lower() for word in ['tool', 'error', 'validation', 'input', 'transaction', 'hash'])
                    and len(sentence) > 40
                ]
                
                if filtered_sentences:
                    reasoning = " ".join(filtered_sentences[:3])  # Take first 3 relevant sentences
                        
            # Set description to hardcoded value
            # description = "Investing strategy1"
            description = os.getenv("DESCRIPTION")
            
            # Create the response
            response = {
                "timestamp": datetime.now(UTC).isoformat(),
                "tx_url": f"{self.explorer_url}{tx_hash}" if tx_hash else None,
                "strategy_id": recommended_strategy_id,
                "reasoning": reasoning,
                "description": description,
                "ai_analysis": {
                    "final_output": str(result),
                    "strategy_recommendation": {
                        "strategy_id": recommended_strategy_id,
                        "reasoning": reasoning
                    }
                }
            }
            
            return response
                
        except Exception as e:
            print(f"❌ Error in crew analysis: {str(e)}")
            raise


class ExecutionCrew:
    """Crew for executing governance proposals"""
    
    def __init__(
        self,
        governance_service: Optional[GovernanceService] = None,
        treasury_address: str = "",
        strategy_address: str = "",
        governance_address: str = "",
        eth_token_address: str = "",
        explorer_url: str = SEPOLIA_EXPLORER_URL
    ):
        self.governance_service = governance_service
        self.treasury_address = treasury_address
        self.strategy_address = strategy_address
        self.governance_address = governance_address
        self.eth_token_address = eth_token_address
        self.explorer_url = explorer_url
        
        # Get LLM
        self.llm = get_llm()
        
        # Create execution tool if governance service is available
        self.execute_tool = None
        if self.governance_service:
            self.execute_tool = ExecuteProposalTool(
                governance_service=self.governance_service,
                treasury_address=self.treasury_address,
                strategy_address=self.strategy_address,
                governance_address=self.governance_address,
                eth_token_address=self.eth_token_address
            )
    
    def _create_execution_agent(self) -> Agent:
        """Create the execution agent"""
        execution_agent = Agent(
            role="Proposal Executor",
            goal="Execute governance proposals that have been approved by the DAO",
            backstory="""You are a proposal execution specialist who handles the technical 
            execution of approved governance proposals. You ensure that proposals are 
            executed correctly and safely, following all necessary protocols.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm,
            tools=[self.execute_tool] if self.execute_tool else []
        )
        return execution_agent
    
    def _create_execution_task(self, agent: Agent) -> Task:
        """Create the execution task"""
        task = Task(
            description=f"""
            Execute the approved governance proposal using the execute_proposal_tool.
            
            IMPORTANT: You must use the execute_proposal_tool to execute the proposal.
            
            Call the execute_proposal_tool with this exact JSON:
            {{"strategy_id": "1", "reasoning": "Executing approved governance proposal for Strategy 1"}}
            
            The tool will handle all the technical details including:
            - Using the correct proposal parameters
            - Generating the correct description hash
            - Submitting the execution transaction
            
            Just call the tool - do not try to do anything else.
            """,
            agent=agent,
            tools=[self.execute_tool] if self.execute_tool else None,
            expected_output="Result of proposal execution with transaction hash or error message"
        )
        return task
    
    def run_execution(self) -> Dict[str, Any]:
        """Run the execution crew and return the results"""
        print("🚀 EXECUTION CREW - AI-Driven Proposal Execution")
        print("=" * 60)
        
        try:
            # Create the execution agent and task
            agent = self._create_execution_agent()
            task = self._create_execution_task(agent)
            
            # Create and run the crew
            crew = Crew(
                agents=[agent],
                tasks=[task],
                verbose=True,
                process=Process.sequential
            )
            
            print("🚀 Starting Proposal Execution...")
            result = crew.kickoff()
            
            # Parse the results
            result_str = str(result)
            
            # Extract transaction hash from the result if present
            tx_hash = None
            if "SUCCESS: Proposal executed with transaction hash:" in result_str:
                # Extract transaction hash from the success message
                import re
                hash_match = re.search(r'0x[a-fA-F0-9]{64}', result_str)
                if hash_match:
                    tx_hash = hash_match.group()
                    print(f"✅ Proposal executed successfully!")
                    print(f"📊 Transaction Hash: {tx_hash}")
                    print(f"🔍 View on Explorer: {self.explorer_url}{tx_hash}")
            elif "ERROR:" in result_str:
                print("❌ Failed to execute proposal:")
                print(result_str)
            
            # Create the response
            response = {
                "timestamp": datetime.now(UTC).isoformat(),
                "tx_url": f"{self.explorer_url}{tx_hash}" if tx_hash else None,
                "execution_result": result_str,
                "success": tx_hash is not None
            }
            
            return response
                
        except Exception as e:
            print(f"❌ Error in execution: {str(e)}")
            raise 