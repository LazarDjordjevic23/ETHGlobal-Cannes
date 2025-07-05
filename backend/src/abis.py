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
        "type": "function",
        "name": "executeStrategy1",
        "inputs": [
          {
            "name": "token",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "executeStrategy2",
        "inputs": [
          {
            "name": "token",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "executeStrategy3",
        "inputs": [
          {
            "name": "token",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "getStrategy1Metrics",
        "inputs": [],
        "outputs": [
          {
            "name": "apy",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "tvl",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "utilizationRate",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "riskAdjustedReturns",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "withdrawalLiquidity",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          }
        ],
        "stateMutability": "pure"
      },
      {
        "type": "function",
        "name": "getStrategy2Metrics",
        "inputs": [],
        "outputs": [
          {
            "name": "apy",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "tvl",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "utilizationRate",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "riskAdjustedReturns",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "withdrawalLiquidity",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          }
        ],
        "stateMutability": "pure"
      },
      {
        "type": "function",
        "name": "getStrategy3Metrics",
        "inputs": [],
        "outputs": [
          {
            "name": "apy",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "tvl",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "utilizationRate",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "riskAdjustedReturns",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "withdrawalLiquidity",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          }
        ],
        "stateMutability": "pure"
      },
      {
        "type": "function",
        "name": "getTokenBalance",
        "inputs": [
          {
            "name": "token",
            "type": "address",
            "internalType": "address"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "event",
        "name": "Strategy1Executed",
        "inputs": [
          {
            "name": "token",
            "type": "address",
            "indexed": False,
            "internalType": "address"
          },
          {
            "name": "amount",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          }
        ],
        "anonymous": False
      },
      {
        "type": "event",
        "name": "Strategy2Executed",
        "inputs": [
          {
            "name": "token",
            "type": "address",
            "indexed": False,
            "internalType": "address"
          },
          {
            "name": "amount",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          }
        ],
        "anonymous": False
      },
      {
        "type": "event",
        "name": "Strategy3Executed",
        "inputs": [
          {
            "name": "token",
            "type": "address",
            "indexed": False,
            "internalType": "address"
          },
          {
            "name": "amount",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          }
        ],
        "anonymous": False
      },
      {
        "type": "error",
        "name": "SafeERC20FailedOperation",
        "inputs": [
          {
            "name": "token",
            "type": "address",
            "internalType": "address"
          }
        ]
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