# Web3 AI Agents Backend

A backend system for Web3 AI agents using CrewAI framework with UV package management.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- [UV Package Manager](https://docs.astral.sh/uv/)

### Installation

1. **Install dependencies:**
   ```bash
   uv sync
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Test the setup:**
   ```bash
   uv run python -m src.ai.crews.capitalist_crew
   ```

## 📁 Project Structure

```
backend/
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules (backend-specific)
├── .venv/               # Virtual environment (UV managed)
├── src/
│   └── ai/              # AI and CrewAI components
│       ├── crews/       # CrewAI crew definitions
│       │   └── capitalist_crew.py   # DeFi strategy crew
│       ├── custom_tools.py          # All custom tools
│       └── utils.py                 # AI utilities and helpers
├── pyproject.toml       # UV package configuration
├── README.md           # This file
└── uv.lock            # Dependency lock file
```

## 🤖 Capitalist Crew

A comprehensive DeFi strategy crew for treasury management and protocol optimization:

### Agents
- **Treasury Monitor**: Tracks positions and performance across protocols
- **Aave Strategy Specialist**: Optimizes lending/borrowing strategies
- **Lido Strategy Specialist**: Manages staking strategies and validators  
- **Generic DeFi Specialist**: Handles other protocols (Compound, Uniswap, Curve)
- **Proposal Strategist**: Synthesizes recommendations into actionable proposals

### Features
- **Dynamic Memory**: Automatically enables memory when OpenAI API key is available
- **File Output**: Saves proposals with timestamps to markdown files
- **Extensible**: Add new protocol agents dynamically
- **Sequential Execution**: Tasks build upon each other for comprehensive analysis
- **Tool Integration**: Uses custom tools for DeFi data and sentiment analysis

### Usage

**Basic Usage:**
```python
from src.ai.crews.capitalist_crew import CapitalistCrew

# Initialize and run
crew = CapitalistCrew()
result = crew.run()
```

**Adding New Protocol Agents:**
```python
# Add support for new DeFi protocol
crew.add_strategy_agent("Compound", "lending and borrowing optimization")
result = crew.run()
```

**Legacy Function (Backward Compatible):**
```python
from src.ai.crews.capitalist_crew import run_defi_strategy_analysis
result = run_defi_strategy_analysis()
```

## 🛠 Custom Tools

All tools are consolidated in `src/ai/custom_tools.py`:

### Available Tools
- **SentimentAnalysisTool**: Analyzes text sentiment for positive communication
- **DeFiDataTool**: Fetches protocol data (TVL, APY, risk metrics)
- **SerperDevTool**: Web search functionality (from crewai-tools)
- **FileReadTool**: File reading operations (from crewai-tools)
- **DirectoryReadTool**: Directory scanning (from crewai-tools)
- **ScrapeWebsiteTool**: Website scraping (from crewai-tools)

### Tool Initialization
Tools are initialized directly in the crew file for better control:
```python
# In capitalist_crew.py
search_tool = SerperDevTool()
defi_data_tool = DeFiDataTool()
sentiment_tool = SentimentAnalysisTool()
```

## 🔧 Environment Variables

Required environment variables (see `.env.example`):

- `OPENAI_API_KEY`: Your OpenAI API key (required for crew execution)
- `SERPER_API_KEY`: (Optional) For web search functionality

## 🧪 Testing

Test the crew structure without API calls:
```bash
# Test crew initialization
uv run python -m src.ai.crews.capitalist_crew

# Test imports
uv run python -c "from src.ai.crews.capitalist_crew import CapitalistCrew; print('✅ Import successful')"
```

## 🛠 Development

### Adding New Tools

1. Add tool class to `src/ai/custom_tools.py`:
```python
class MyCustomTool(BaseTool):
    name: str = "My Custom Tool"
    description: str = "Description of what the tool does"
    
    def _run(self, input_param: str) -> str:
        # Your tool logic here
        return "result"
```

2. Initialize in crew file:
```python
my_tool = MyCustomTool()
# Add to agent tools list
```

### Available Utilities

From `src.ai.utils`:
- `create_agent()` - Create CrewAI agents with standard parameters
- `create_task()` - Create CrewAI tasks with context support
- `create_and_run_crew()` - Run complete crews with configuration
- `load_api_keys()` - Environment variable management

## 📦 Package Management

This project uses UV for fast Python package management:

- `uv sync` - Install dependencies
- `uv add <package>` - Add new dependency
- `uv run <command>` - Run commands in virtual environment

### Dependencies

Core packages:
- `crewai>=0.126.0` - Multi-agent framework
- `web3>=7.12.0` - Blockchain interactions
- `pydantic>=2.11.3` - Data validation
- `crewai-tools>=0.40.0` - Additional tools
- `requests>=2.32.3` - HTTP requests
- `python-dotenv>=1.1.0` - Environment management

## 🔍 Key Features

- **Ultra-Simplified Architecture**: No __init__.py files needed
- **Flat Tool Structure**: All tools in one file at root level
- **Direct Initialization**: Tools initialized in crew file for better control
- **Memory Management**: Dynamic memory enablement based on API key availability
- **Error Handling**: Graceful fallbacks for missing API keys
- **Extensible Design**: Easy to add new agents and protocols
- **Backward Compatibility**: Legacy functions maintained

## 🎯 DeFi Strategy Output

The crew generates comprehensive strategy proposals including:

1. **Executive Summary** - Current position overview
2. **Treasury Analysis** - Balance monitoring and risk assessment
3. **Protocol Strategies** - Specific recommendations for Aave, Lido, etc.
4. **Risk Mitigation** - Identified risks and mitigation strategies
5. **Implementation Plan** - Timeline and action items
6. **Success Metrics** - Expected outcomes and KPIs

## 📊 Project Statistics

- **Python files**: 3 total
- **__init__.py files**: 0 (completely removed)
- **Tools**: All consolidated in single file
- **Crews**: 1 comprehensive DeFi strategy crew
- **Clean imports**: No package initialization required

## 🔍 Note on Nested .gitignore

This backend directory has its own `.gitignore` to handle backend-specific files (`.venv/`, `uv.lock`, etc.) without affecting the parent repository's ignore rules.