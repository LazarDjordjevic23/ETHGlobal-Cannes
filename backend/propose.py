import os
import json
from datetime import datetime
from typing import Dict, List, Optional, Union
from dataclasses import dataclass

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

from crewai import Agent, Task, Crew, Process
from crewai_tools import FileReadTool

# Web3 and wallet abstraction imports
from web3 import Web3
from eth_account import Account
from eth_account.signers.local import LocalAccount
from eth_account.messages import encode_defunct
import requests

# Contract ABIs for the specific contracts
TREASURY_ABI = [
    {
        "inputs": [{"name": "token", "type": "address"}],
        "name": "getTokenBalance",
        "outputs": [{"name": "", "type": "uint256"}],
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getEtherBalance",
        "outputs": [{"name": "", "type": "uint256"}],
        "type": "function"
    }
]

STRATEGY_ABI = [
    {
        "inputs": [],
        "name": "getStrategy1Metrics",
        "outputs": [
            {"name": "apy", "type": "uint256"},
            {"name": "tvl", "type": "uint256"},
            {"name": "utilizationRate", "type": "uint256"},
            {"name": "riskAdjustedReturns", "type": "uint256"},
            {"name": "withdrawalLiquidity", "type": "uint256"},
            {"name": "description", "type": "string"}
        ],
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getStrategy2Metrics",
        "outputs": [
            {"name": "apy", "type": "uint256"},
            {"name": "tvl", "type": "uint256"},
            {"name": "utilizationRate", "type": "uint256"},
            {"name": "riskAdjustedReturns", "type": "uint256"},
            {"name": "withdrawalLiquidity", "type": "uint256"},
            {"name": "description", "type": "string"}
        ],
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getStrategy3Metrics",
        "outputs": [
            {"name": "apy", "type": "uint256"},
            {"name": "tvl", "type": "uint256"},
            {"name": "utilizationRate", "type": "uint256"},
            {"name": "riskAdjustedReturns", "type": "uint256"},
            {"name": "withdrawalLiquidity", "type": "uint256"},
            {"name": "description", "type": "string"}
        ],
        "type": "function"
    },
    {
        "inputs": [
            {"name": "token", "type": "address"},
            {"name": "amount", "type": "uint256"}
        ],
        "name": "executeStrategy1",
        "outputs": [],
        "type": "function"
    },
    {
        "inputs": [
            {"name": "token", "type": "address"},
            {"name": "amount", "type": "uint256"}
        ],
        "name": "executeStrategy2",
        "outputs": [],
        "type": "function"
    },
    {
        "inputs": [
            {"name": "token", "type": "address"},
            {"name": "amount", "type": "uint256"}
        ],
        "name": "executeStrategy3",
        "outputs": [],
        "type": "function"
    }
]

GOVERNANCE_ABI = [
    {
        "inputs": [
            {"name": "targets", "type": "address[]"},
            {"name": "values", "type": "uint256[]"},
            {"name": "calldatas", "type": "bytes[]"},
            {"name": "description", "type": "string"}
        ],
        "name": "propose",
        "outputs": [{"name": "proposalId", "type": "uint256"}],
        "type": "function"
    }
]

ETHToken_ABI = [
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "type": "function"
    }
]

@dataclass
class TreasuryBalance:
    token_address: str
    token_name: str
    token_symbol: str
    balance: int
    balance_formatted: float

@dataclass
class StrategyMetrics:
    strategy_id: int
    apy: int  # in basis points
    tvl: int  # in wei
    utilization_rate: int  # in basis points
    risk_adjusted_returns: int  # in basis points
    withdrawal_liquidity: int  # in basis points
    description: str

@dataclass
class TreasuryData:
    treasury_address: str
    eth_balance: int
    eth_token_balance: int
    eth_token_symbol: str
    total_value_usd: float

@dataclass
class StrategyAnalysis:
    strategies: List[StrategyMetrics]
    best_strategy: StrategyMetrics
    reasoning: str
    expected_profit: float

@dataclass
class GovernanceProposal:
    description: str
    targets: List[str]
    values: List[int]
    calldatas: List[bytes]
    reasoning: str

# Configuration
RPC_URL = os.getenv("ETHEREUM_RPC_URL", "https://sepolia.infura.io/v3/your-project-id")
PRIVATE_KEY = os.getenv("AI_AGENT_PRIVATE_KEY", "")
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

class TreasuryService:
    """Service for interacting with the Treasury contract"""
    
    def __init__(self, rpc_url: str):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        if not self.w3.is_connected():
            raise ValueError(f"Failed to connect to RPC: {rpc_url}")
    
    def get_treasury_data(self, treasury_address: str, eth_token_address: str) -> TreasuryData:
        """Get treasury balance data"""
        treasury_contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(treasury_address),
            abi=TREASURY_ABI
        )
        
        eth_token_contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(eth_token_address),
            abi=ETHToken_ABI
        )
        
        # Get ETH balance
        eth_balance = treasury_contract.functions.getEtherBalance().call()
        
        # Get ETHToken balance
        eth_token_balance = treasury_contract.functions.getTokenBalance(eth_token_address).call()
        
        # Get token symbol
        eth_token_symbol = eth_token_contract.functions.symbol().call()
        
        # Calculate total value (simplified - in real implementation you'd get ETH price)
        eth_price_usd = 2000  # Mock price for demo
        total_value_usd = (eth_balance / 1e18) * eth_price_usd
        
        return TreasuryData(
            treasury_address=treasury_address,
            eth_balance=eth_balance,
            eth_token_balance=eth_token_balance,
            eth_token_symbol=eth_token_symbol,
            total_value_usd=total_value_usd
        )

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

class GovernanceService:
    """Service for creating governance proposals"""
    
    def __init__(self, rpc_url: str, private_key: str):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        if not self.w3.is_connected():
            raise ValueError(f"Failed to connect to RPC: {rpc_url}")
        
        self.account = Account.from_key(private_key)
        self.w3.eth.default_account = self.account.address
    
    def create_proposal(self, governance_address: str, proposal: GovernanceProposal) -> Optional[str]:
        """Create a governance proposal"""
        governance_contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(governance_address),
            abi=GOVERNANCE_ABI
        )
        
        try:
            # Check account balance first
            balance = self.w3.eth.get_balance(self.account.address)
            gas_price = self.w3.eth.gas_price
            estimated_gas = 500000
            estimated_cost = gas_price * estimated_gas
            
            print(f"👤 Account Address: {self.account.address}")
            print(f"💰 Account Balance: {balance / 1e18:.6f} ETH")
            print(f"⛽ Gas Price: {gas_price / 1e9:.2f} Gwei")
            print(f"🔥 Estimated Gas: {estimated_gas:,}")
            print(f"💸 Estimated Cost: {estimated_cost / 1e18:.6f} ETH")
            
            if balance < estimated_cost:
                print(f"❌ Insufficient funds: Need {estimated_cost / 1e18:.6f} ETH, have {balance / 1e18:.6f} ETH")
                return None
            
            # Build transaction
            tx = governance_contract.functions.propose(
                proposal.targets,
                proposal.values,
                proposal.calldatas,
                proposal.description
            ).build_transaction({
                'from': self.account.address,
                'gas': estimated_gas,
                'gasPrice': gas_price,
                'nonce': self.w3.eth.get_transaction_count(self.account.address)
            })
            
            # Sign and send transaction
            signed_tx = self.w3.eth.account.sign_transaction(tx, self.account.key)
            try:
                raw_tx = signed_tx.raw_transaction
            except AttributeError:
                print("[DEBUG] signed_tx object:", signed_tx)
                print("[DEBUG] signed_tx type:", type(signed_tx))
                print("[DEBUG] signed_tx dir:", dir(signed_tx))
                raise RuntimeError("Could not access raw_transaction on signed_tx. See debug output above.")
            
            print("📤 Sending transaction...")
            tx_hash = self.w3.eth.send_raw_transaction(raw_tx)
            
            print(f"✅ Transaction sent: {self.w3.to_hex(tx_hash)}")
            return self.w3.to_hex(tx_hash)
            
        except Exception as e:
            print(f"❌ Error creating proposal: {e}")
            return None

def run_capitalist_crew():
    """Run the capitalist crew with the three-agent flow using CrewAI"""
    print("🤖 CAPITALIST CREW - AI-Driven Treasury Management")
    print("=" * 60)
    
    try:
        # Initialize services
        treasury_service = TreasuryService(RPC_URL)
        strategy_service = StrategyService(RPC_URL)
        
        # Get LLM
        llm = get_llm()
        
        # Create Treasury Agent
        treasury_agent = Agent(
            role="Treasury Analyst",
            goal="Analyze current treasury balances and financial position",
            backstory="""You are an expert treasury analyst with deep knowledge of DeFi protocols and 
            financial risk management. You specialize in analyzing treasury positions and understanding 
            the current financial state of DAOs.""",
            verbose=True,
            allow_delegation=False,
            llm=llm,
            tools=[
                FileReadTool()
            ]
        )
        
        # Create Strategy Agent
        strategy_agent = Agent(
            role="Strategy Evaluator",
            goal="Evaluate available investment strategies and their risk-return profiles",
            backstory="""You are a DeFi strategy expert with years of experience in yield farming, 
            liquidity provision, and risk assessment. You understand the nuances of different 
            investment strategies and can evaluate their suitability based on market conditions 
            and treasury requirements.""",
            verbose=True,
            allow_delegation=False,
            llm=llm,
            tools=[
                FileReadTool()
            ]
        )
        
        # Create Proposal Making Agent
        proposal_agent = Agent(
            role="Governance Proposal Creator",
            goal="Create optimal governance proposals based on treasury analysis and strategy evaluation",
            backstory="""You are a governance expert who creates clear, actionable proposals for DAOs. 
            You understand the technical requirements of governance systems and can translate 
            strategic decisions into executable proposals. You always provide clear reasoning 
            for your recommendations.""",
            verbose=True,
            allow_delegation=False,
            llm=llm,
            tools=[
                FileReadTool()
            ]
        )
        
        # Get treasury data
        print("📊 TREASURY AGENT: Analyzing treasury balances...")
        treasury_data = treasury_service.get_treasury_data(TREASURY_ADDRESS, ETHToken_ADDRESS)
        
        # Get strategy data
        print("📈 STRATEGY AGENT: Analyzing available strategies...")
        strategies = strategy_service.get_all_strategies(STRATEGY_ADDRESS)
        
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
        
        # Create Treasury Analysis Task
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
        
        # Create Strategy Evaluation Task
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
        
        # Create Proposal Creation Task
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
        
        # Create and run the crew
        crew = Crew(
            agents=[treasury_agent, strategy_agent, proposal_agent],
            tasks=[treasury_task, strategy_task, proposal_task],
            verbose=True,
            process=Process.sequential
        )
        
        print("🚀 Starting AI Crew Analysis...")
        result = crew.kickoff()
        
        print("\n📋 CREW ANALYSIS RESULTS:")
        print("=" * 60)
        print(result)
        
        # Parse the results and create the actual proposal
        try:
            # Extract the final proposal from the result
            import re
            import json
            
            # Convert result to string for regex search
            result_str = str(result)
            
            # Try to extract JSON from the result
            json_match = re.search(r'\{.*\}', result_str, re.DOTALL)
            if json_match:
                proposal_data = json.loads(json_match.group())
                
                # Get the recommended strategy
                recommended_strategy_id = int(proposal_data.get("strategy_id", 1))
                recommended_strategy = next(s for s in strategies if s.strategy_id == recommended_strategy_id)
                
                # Create the actual governance proposal
                print(f"\n🎯 AI RECOMMENDATION: Strategy {recommended_strategy_id}")
                print(f"📝 Reasoning: {proposal_data.get('reasoning', 'N/A')}")
                print(f"💰 Expected Profit: {proposal_data.get('expected_profit', 'N/A')}")
                
                # Encode strategy execution call
                strategy_contract = Web3().eth.contract(
                    address=Web3.to_checksum_address(STRATEGY_ADDRESS),
                    abi=STRATEGY_ABI
                )
                
                # Create calldata for strategy execution
                if recommended_strategy_id == 1:
                    strategy_calldata = strategy_contract.functions.executeStrategy1(
                        ETHToken_ADDRESS, treasury_data.eth_token_balance
                    )._encode_transaction_data()
                elif recommended_strategy_id == 2:
                    strategy_calldata = strategy_contract.functions.executeStrategy2(
                        ETHToken_ADDRESS, treasury_data.eth_token_balance
                    )._encode_transaction_data()
                else:
                    strategy_calldata = strategy_contract.functions.executeStrategy3(
                        ETHToken_ADDRESS, treasury_data.eth_token_balance
                    )._encode_transaction_data()
                
                # Encode Treasury.execute() call
                treasury_contract = Web3().eth.contract(
                    address=Web3.to_checksum_address(TREASURY_ADDRESS),
                    abi=[
                        {
                            "inputs": [
                                {"name": "target", "type": "address"},
                                {"name": "value", "type": "uint256"},
                                {"name": "data", "type": "bytes"}
                            ],
                            "name": "execute",
                            "outputs": [
                                {"name": "success", "type": "bool"},
                                {"name": "returnData", "type": "bytes"}
                            ],
                            "type": "function"
                        }
                    ]
                )
                
                # Create the final calldata: Treasury.execute(strategy_address, 0, strategy_calldata)
                final_calldata = treasury_contract.functions.execute(
                    STRATEGY_ADDRESS,  # target: strategy contract
                    0,  # value: 0 ETH
                    Web3.to_bytes(hexstr=strategy_calldata)  # data: encoded strategy call
                )._encode_transaction_data()
                
                proposal = GovernanceProposal(
                    description=proposal_data.get("proposal_description", f"Execute Strategy {recommended_strategy_id} based on AI analysis"),
                    targets=[TREASURY_ADDRESS],
                    values=[0],
                    calldatas=[final_calldata],
                    reasoning=proposal_data.get("reasoning", f"Strategy {recommended_strategy_id} selected by AI analysis")
                )
                
                # Debug output for governance proposal structure
                print(f"\n🔧 GOVERNANCE PROPOSAL STRUCTURE:")
                print(f"   Target: {TREASURY_ADDRESS} (Treasury Contract)")
                print(f"   Value: 0 ETH")
                print(f"   Strategy Calldata: {strategy_calldata[:66]}...")
                print(f"   Final Calldata: {final_calldata[:66]}...")
                print(f"   Strategy: Strategy {recommended_strategy_id}")
                print(f"   Token Amount: {treasury_data.eth_token_balance / 1e18:.2f} {treasury_data.eth_token_symbol}")
                print(f"   Flow: Governance → Treasury.execute() → Strategy.executeStrategy{recommended_strategy_id}()")
                
                # Submit proposal if private key is available
                if PRIVATE_KEY:
                    governance_service = GovernanceService(RPC_URL, PRIVATE_KEY)
                    tx_hash = governance_service.create_proposal(GOVERNANCE_ADDRESS, proposal)
                    
                    if tx_hash:
                        print(f"✅ AI Proposal submitted successfully!")
                        print(f"📝 Transaction Hash: {tx_hash}")
                        print(f"🎯 AI-Selected Strategy: Strategy {recommended_strategy_id}")
                        print(f"💰 Expected APY: {recommended_strategy.apy / 100:.2f}%")
                        print(f"🤖 AI Reasoning: {proposal.reasoning}")
                        
                        # Save results
                        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                        filename = f"ai_crew_proposal_{timestamp}.json"
                        
                        # Extract relevant information from CrewOutput
                        result_data = {
                            "timestamp": datetime.now().isoformat(),
                            "tx_hash": tx_hash,
                            "ai_analysis": {
                                "final_output": str(result),
                                "strategy_recommendation": {
                                    "strategy_id": recommended_strategy_id,
                                    "reasoning": proposal_data.get('reasoning', 'N/A'),
                                    "expected_profit": proposal_data.get('expected_profit', 'N/A')
                                }
                            },
                            "strategy_id": recommended_strategy_id,
                            "expected_apy": recommended_strategy.apy / 100,
                            "reasoning": proposal.reasoning,
                            "treasury_data": {
                                "eth_balance": str(treasury_data.eth_balance),  # Convert to string to avoid integer overflow
                                "eth_token_balance": str(treasury_data.eth_token_balance),
                                "total_value_usd": float(treasury_data.total_value_usd)
                            },
                            "strategy_metrics": {
                                "apy": str(recommended_strategy.apy),
                                "tvl": str(recommended_strategy.tvl),
                                "risk_adjusted_returns": str(recommended_strategy.risk_adjusted_returns),
                                "withdrawal_liquidity": str(recommended_strategy.withdrawal_liquidity)
                            }
                        }
                        
                        with open(filename, 'w') as f:
                            json.dump(result_data, f, indent=2)
                        
                        print(f"📁 Results saved to: {filename}")
                        return tx_hash
                    else:
                        print("❌ Failed to submit proposal")
                        return None
                else:
                    print("⚠️ No private key provided - showing AI proposal details only")
                    print(f"📝 Proposal Description: {proposal.description}")
                    print(f"🎯 AI-Selected Strategy: Strategy {recommended_strategy_id}")
                    print(f"💰 Expected APY: {recommended_strategy.apy / 100:.2f}%")
                    print(f"🤖 AI Reasoning: {proposal.reasoning}")
                    return "DEMO_MODE"
            else:
                print("❌ Could not parse AI analysis results")
                return None
                
        except Exception as e:
            print(f"❌ Error parsing AI results: {str(e)}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    print("🚀 Starting AI-Driven Treasury Management Crew...")
    result = run_capitalist_crew()
    
    if result:
        print("\n🎉 AI-DRIVEN PROPOSAL CREATED!")
        print("=" * 60)
        print("✅ Treasury Agent: Analyzed current balances and financial health")
        print("📈 Strategy Agent: Evaluated all 3 strategies with risk assessment")
        print("🎯 Proposal Agent: Created optimal governance proposal")
        print("🤖 AI Decision: Strategy selection based on comprehensive analysis")
        print("📊 Multi-factor Analysis: APY, risk, liquidity, and market conditions")
        print("📝 Governance proposal ready for DAO voting")
    else:
        print("❌ Something went wrong") 