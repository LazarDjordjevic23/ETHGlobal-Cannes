"""
Contract ABIs for the DAO Treasury Management system.
"""

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