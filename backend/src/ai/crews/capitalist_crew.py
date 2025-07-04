"""
Capitalist Crew implementation using CrewAI for DeFi strategy analysis
"""
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool, FileReadTool, DirectoryReadTool
from typing import List, Dict, Any
import sys
import os
from datetime import datetime

# Add the project root to Python path to fix imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from src.ai.utils import create_agent, create_task
from src.ai.custom_tools import SentimentAnalysisTool, DeFiDataTool


class CapitalistCrew:
    """
    DeFi Strategy Analysis Crew for treasury monitoring and protocol optimization
    """
    
    def __init__(self):
        self.agents = []
        self.tasks = []
        self.crew = None
        self.setup_agents()
        self.setup_tasks()
        self.setup_crew()
    
    def setup_agents(self):
        """Initialize agents for the DeFi strategy crew"""
        
        # Initialize tools directly in the crew
        search_tool = SerperDevTool()
        file_read_tool = FileReadTool()
        directory_read_tool = DirectoryReadTool()
        defi_data_tool = DeFiDataTool()
        sentiment_tool = SentimentAnalysisTool()
        
        # Treasury Monitor Agent
        treasury_monitor = create_agent(
            role='Treasury Monitor',
            goal='Monitor treasury positions, balances, and performance across all DeFi protocols',
            backstory="""You are an expert treasury analyst specializing in DeFi protocols. 
            Your job is to continuously monitor treasury positions, track balances, 
            identify risks, and provide real-time insights on portfolio performance.""",
            tools=[search_tool, file_read_tool, defi_data_tool],
            allow_delegation=False,
            verbose=True
        )
        
        # Aave Strategy Agent
        aave_strategy_agent = create_agent(
            role='Aave Strategy Specialist',
            goal='Analyze and optimize Aave lending/borrowing strategies',
            backstory="""You are a DeFi strategy expert specializing in Aave protocol. 
            You understand lending rates, borrowing costs, liquidation risks, and 
            optimal capital allocation strategies for Aave positions.""",
            tools=[search_tool, defi_data_tool],
            allow_delegation=False,
            verbose=True
        )
        
        # Lido Strategy Agent
        lido_strategy_agent = create_agent(
            role='Lido Strategy Specialist',
            goal='Analyze and optimize Lido staking strategies',
            backstory="""You are a DeFi strategy expert specializing in Lido staking. 
            You understand staking yields, validator risks, withdrawal dynamics, 
            and optimal staking strategies for ETH and other assets.""",
            tools=[search_tool, defi_data_tool],
            allow_delegation=False,
            verbose=True
        )
        
        # Generic Strategy Agent
        generic_strategy_agent = create_agent(
            role='Generic DeFi Strategy Specialist',
            goal='Analyze and optimize strategies for various DeFi protocols',
            backstory="""You are a versatile DeFi strategy expert capable of analyzing 
            various protocols including Compound, Uniswap, Curve, and others. 
            You adapt your analysis based on the specific protocol requirements.""",
            tools=[search_tool, defi_data_tool],
            allow_delegation=False,
            verbose=True
        )
        
        # Proposal Making Agent
        proposal_agent = create_agent(
            role='Proposal Strategist',
            goal='Synthesize inputs from all agents to create actionable strategy proposals',
            backstory="""You are a senior DeFi strategist responsible for creating 
            comprehensive proposals based on inputs from treasury monitoring and 
            strategy specialists. You excel at risk assessment, capital allocation, 
            and presenting clear actionable recommendations.""",
            tools=[search_tool, file_read_tool, directory_read_tool, sentiment_tool],
            allow_delegation=True,
            verbose=True
        )
        
        self.agents = [treasury_monitor, aave_strategy_agent, lido_strategy_agent, generic_strategy_agent, proposal_agent]
    
    def setup_tasks(self):
        """Initialize tasks for the DeFi strategy crew"""
        
        # Treasury Monitoring Task
        treasury_monitoring_task = create_task(
            description="""Monitor the current treasury positions and provide a comprehensive report including:
            1. Current balances across all protocols
            2. Performance metrics (APY, returns, losses)
            3. Risk assessment (liquidation risks, impermanent loss, etc.)
            4. Any alerts or concerning trends

            Focus on providing accurate, up-to-date financial data.""",
            expected_output="Detailed treasury status report with metrics and risk assessment",
            agent=self.agents[0],  # Treasury Monitor
            human_input=False,
            async_execution=False
        )
        
        # Aave Strategy Task
        aave_strategy_task = create_task(
            description="""Analyze current Aave positions and market conditions to provide:
            1. Current lending/borrowing rates analysis
            2. Optimal capital allocation recommendations
            3. Risk mitigation strategies
            4. Yield optimization opportunities

            Consider current market conditions and protocol updates.""",
            expected_output="Aave strategy recommendations with specific actions and expected outcomes",
            agent=self.agents[1],  # Aave Strategy Agent
            human_input=False,
            async_execution=False
        )
        
        # Lido Strategy Task
        lido_strategy_task = create_task(
            description="""Analyze current Lido staking positions and provide:
            1. Current staking yields analysis
            2. Validator performance assessment
            3. Withdrawal queue analysis
            4. Staking optimization recommendations

            Consider current Ethereum network conditions and Lido protocol updates.""",
            expected_output="Lido strategy recommendations with specific actions and expected outcomes",
            agent=self.agents[2],  # Lido Strategy Agent
            human_input=False,
            async_execution=False
        )
        
        # Proposal Creation Task
        proposal_creation_task = create_task(
            description="""Based on inputs from treasury monitoring and strategy agents, create a comprehensive proposal that includes:
            1. Executive summary of current position
            2. Strategic recommendations with rationale
            3. Risk analysis and mitigation strategies
            4. Implementation timeline
            5. Expected outcomes and success metrics

            Ensure the proposal is actionable and clearly prioritized.""",
            expected_output="Comprehensive strategy proposal document with clear recommendations and implementation plan",
            agent=self.agents[4],  # Proposal Agent
            human_input=False,
            async_execution=False,
            context=[treasury_monitoring_task, aave_strategy_task, lido_strategy_task]
        )
        
        self.tasks = [treasury_monitoring_task, aave_strategy_task, lido_strategy_task, proposal_creation_task]
    
    def setup_crew(self, enable_memory: bool = False):
        """Initialize the crew with agents and tasks"""
        crew_config = {
            "agents": self.agents,
            "tasks": self.tasks,
            "verbose": True,
            "process": Process.sequential,
            "memory": enable_memory
        }
        
        # Add embedder config only when memory is enabled and API key is available
        if enable_memory and os.getenv("OPENAI_API_KEY"):
            crew_config["embedder"] = {
                "provider": "openai",
                "config": {
                    "model": "text-embedding-3-small"
                }
            }
        
        self.crew = Crew(**crew_config)
    
    def run(self, inputs: Dict[str, Any] = None) -> Any:
        """
        Run the DeFi strategy analysis crew
        
        Args:
            inputs: Optional dictionary containing input parameters
            
        Returns:
            Result from crew execution
        """
        if not self.crew:
            raise ValueError("Crew not initialized")
        
        # Recreate crew with memory enabled if API key is available
        if os.getenv("OPENAI_API_KEY"):
            print("🔑 OpenAI API key detected, enabling memory and embedder...")
            self.setup_crew(enable_memory=True)
        
        print("🚀 Starting DeFi Strategy Analysis...")
        print("=" * 50)
        
        try:
            # Execute the crew
            result = self.crew.kickoff(inputs=inputs)
            
            # Save results to file
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"defi_strategy_proposal_{timestamp}.md"
            
            with open(filename, 'w') as f:
                f.write("# DeFi Strategy Analysis Results\n\n")
                f.write(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
                f.write("## Final Proposal\n\n")
                f.write(str(result))
            
            print(f"✅ Analysis completed! Results saved to: {filename}")
            return result
            
        except Exception as e:
            print(f"❌ Error running analysis: {str(e)}")
            return None
    
    def add_strategy_agent(self, protocol_name: str, specialization: str):
        """Add a new strategy agent for a specific protocol"""
        # Initialize tools for new agent
        search_tool = SerperDevTool()
        defi_data_tool = DeFiDataTool()
        
        new_agent = create_agent(
            role=f'{protocol_name} Strategy Specialist',
            goal=f'Analyze and optimize {protocol_name} strategies',
            backstory=f"""You are a DeFi strategy expert specializing in {protocol_name}. 
            You understand the specific mechanics, risks, and opportunities of {protocol_name} 
            and can provide detailed analysis and recommendations for {specialization}.""",
            tools=[search_tool, defi_data_tool],
            allow_delegation=False,
            verbose=True
        )
        
        new_task = create_task(
            description=f"""Analyze current {protocol_name} positions and provide:
            1. Current protocol metrics and performance
            2. Optimal strategy recommendations
            3. Risk assessment and mitigation
            4. Yield optimization opportunities

            Focus on {specialization} strategies.""",
            expected_output=f"{protocol_name} strategy recommendations with specific actions",
            agent=new_agent,
            human_input=False,
            async_execution=False
        )
        
        # Add to existing agents and tasks
        self.agents.append(new_agent)
        self.tasks.insert(-1, new_task)  # Insert before the proposal task
        
        # Update proposal task context
        self.tasks[-1] = create_task(
            description=self.tasks[-1].description,
            expected_output=self.tasks[-1].expected_output,
            agent=self.tasks[-1].agent,
            human_input=False,
            async_execution=False,
            context=self.tasks[:-1]  # All tasks except the proposal task itself
        )
        
        # Recreate crew with updated agents and tasks
        self.setup_crew(enable_memory=False)
        
        return new_agent, new_task


# Simple test without API keys
def test_crew_structure():
    """Test that the crew can be initialized without errors"""
    try:
        print("Testing Capitalist crew initialization...")
        crew = CapitalistCrew()
        print("✅ Capitalist Crew initialized successfully!")
        print(f"   - Agents: {len(crew.agents)}")
        print(f"   - Tasks: {len(crew.tasks)}")
        print(f"   - Crew created: {crew.crew is not None}")
        return True
    except Exception as e:
        print(f"❌ Error initializing crew: {e}")
        import traceback
        traceback.print_exc()
        return False


# Function to run the crew (for backward compatibility)
def run_defi_strategy_analysis():
    """Execute the DeFi strategy analysis crew"""
    crew = CapitalistCrew()
    return crew.run()


# Example usage
if __name__ == "__main__":
    # First test structure without API calls
    if test_crew_structure():
        print("\n🎉 Capitalist Crew structure is working correctly!")
        print("\nTo run the actual crew execution, you need to:")
        print("1. Set OPENAI_API_KEY environment variable")
        print("2. Then call crew.run()")
        print("\nExample usage:")
        print("crew = CapitalistCrew()")
        print("result = crew.run()")
        print("\nOr use the legacy function:")
        print("result = run_defi_strategy_analysis()")
    else:
        print("\n❌ Capitalist Crew structure test failed")
        sys.exit(1)