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
        "type": "constructor",
        "inputs": [
          {
            "name": "_name",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "_token",
            "type": "address",
            "internalType": "contract IVotes"
          },
          {
            "name": "_initialVotingDelay",
            "type": "uint48",
            "internalType": "uint48"
          },
          {
            "name": "_initialVotingPeriod",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "_initialProposalThreshold",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "_quorumNumeratorValue",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "stateMutability": "nonpayable"
      },
      {
        "type": "receive",
        "stateMutability": "payable"
      },
      {
        "type": "function",
        "name": "BALLOT_TYPEHASH",
        "inputs": [],
        "outputs": [
          {
            "name": "",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "CLOCK_MODE",
        "inputs": [],
        "outputs": [
          {
            "name": "",
            "type": "string",
            "internalType": "string"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "COUNTING_MODE",
        "inputs": [],
        "outputs": [
          {
            "name": "",
            "type": "string",
            "internalType": "string"
          }
        ],
        "stateMutability": "pure"
      },
      {
        "type": "function",
        "name": "EXTENDED_BALLOT_TYPEHASH",
        "inputs": [],
        "outputs": [
          {
            "name": "",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "cancel",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "cancel",
        "inputs": [
          {
            "name": "targets",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "values",
            "type": "uint256[]",
            "internalType": "uint256[]"
          },
          {
            "name": "calldatas",
            "type": "bytes[]",
            "internalType": "bytes[]"
          },
          {
            "name": "descriptionHash",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "castVote",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "support",
            "type": "uint8",
            "internalType": "uint8"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "castVoteBySig",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "support",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "voter",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "castVoteWithReason",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "support",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "reason",
            "type": "string",
            "internalType": "string"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "castVoteWithReasonAndParams",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "support",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "reason",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "params",
            "type": "bytes",
            "internalType": "bytes"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "castVoteWithReasonAndParamsBySig",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "support",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "voter",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "reason",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "params",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "clock",
        "inputs": [],
        "outputs": [
          {
            "name": "",
            "type": "uint48",
            "internalType": "uint48"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "eip712Domain",
        "inputs": [],
        "outputs": [
          {
            "name": "fields",
            "type": "bytes1",
            "internalType": "bytes1"
          },
          {
            "name": "name",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "version",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "chainId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "verifyingContract",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "salt",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "extensions",
            "type": "uint256[]",
            "internalType": "uint256[]"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "execute",
        "inputs": [
          {
            "name": "targets",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "values",
            "type": "uint256[]",
            "internalType": "uint256[]"
          },
          {
            "name": "calldatas",
            "type": "bytes[]",
            "internalType": "bytes[]"
          },
          {
            "name": "descriptionHash",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "stateMutability": "payable"
      },
      {
        "type": "function",
        "name": "execute",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "outputs": [],
        "stateMutability": "payable"
      },
      {
        "type": "function",
        "name": "getProposalId",
        "inputs": [
          {
            "name": "targets",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "values",
            "type": "uint256[]",
            "internalType": "uint256[]"
          },
          {
            "name": "calldatas",
            "type": "bytes[]",
            "internalType": "bytes[]"
          },
          {
            "name": "descriptionHash",
            "type": "bytes32",
            "internalType": "bytes32"
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
        "type": "function",
        "name": "getVotes",
        "inputs": [
          {
            "name": "account",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "timepoint",
            "type": "uint256",
            "internalType": "uint256"
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
        "type": "function",
        "name": "getVotesWithParams",
        "inputs": [
          {
            "name": "account",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "timepoint",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "params",
            "type": "bytes",
            "internalType": "bytes"
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
        "type": "function",
        "name": "hasVoted",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "account",
            "type": "address",
            "internalType": "address"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "bool",
            "internalType": "bool"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "hashProposal",
        "inputs": [
          {
            "name": "targets",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "values",
            "type": "uint256[]",
            "internalType": "uint256[]"
          },
          {
            "name": "calldatas",
            "type": "bytes[]",
            "internalType": "bytes[]"
          },
          {
            "name": "descriptionHash",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "stateMutability": "pure"
      },
      {
        "type": "function",
        "name": "name",
        "inputs": [],
        "outputs": [
          {
            "name": "",
            "type": "string",
            "internalType": "string"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "nonces",
        "inputs": [
          {
            "name": "owner",
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
        "type": "function",
        "name": "onERC1155BatchReceived",
        "inputs": [
          {
            "name": "",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "",
            "type": "uint256[]",
            "internalType": "uint256[]"
          },
          {
            "name": "",
            "type": "uint256[]",
            "internalType": "uint256[]"
          },
          {
            "name": "",
            "type": "bytes",
            "internalType": "bytes"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "bytes4",
            "internalType": "bytes4"
          }
        ],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "onERC1155Received",
        "inputs": [
          {
            "name": "",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "",
            "type": "bytes",
            "internalType": "bytes"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "bytes4",
            "internalType": "bytes4"
          }
        ],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "onERC721Received",
        "inputs": [
          {
            "name": "",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "",
            "type": "bytes",
            "internalType": "bytes"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "bytes4",
            "internalType": "bytes4"
          }
        ],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "proposalCount",
        "inputs": [],
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
        "type": "function",
        "name": "proposalDeadline",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
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
        "type": "function",
        "name": "proposalDetails",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "outputs": [
          {
            "name": "targets",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "values",
            "type": "uint256[]",
            "internalType": "uint256[]"
          },
          {
            "name": "calldatas",
            "type": "bytes[]",
            "internalType": "bytes[]"
          },
          {
            "name": "descriptionHash",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "proposalDetailsAt",
        "inputs": [
          {
            "name": "index",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "outputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "targets",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "values",
            "type": "uint256[]",
            "internalType": "uint256[]"
          },
          {
            "name": "calldatas",
            "type": "bytes[]",
            "internalType": "bytes[]"
          },
          {
            "name": "descriptionHash",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "proposalEta",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
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
        "type": "function",
        "name": "proposalNeedsQueuing",
        "inputs": [
          {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "bool",
            "internalType": "bool"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "proposalProposer",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "address",
            "internalType": "address"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "proposalSnapshot",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
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
        "type": "function",
        "name": "proposalThreshold",
        "inputs": [],
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
        "type": "function",
        "name": "proposalVotes",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "outputs": [
          {
            "name": "againstVotes",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "forVotes",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "abstainVotes",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "propose",
        "inputs": [
          {
            "name": "targets",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "values",
            "type": "uint256[]",
            "internalType": "uint256[]"
          },
          {
            "name": "calldatas",
            "type": "bytes[]",
            "internalType": "bytes[]"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "queue",
        "inputs": [
          {
            "name": "targets",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "values",
            "type": "uint256[]",
            "internalType": "uint256[]"
          },
          {
            "name": "calldatas",
            "type": "bytes[]",
            "internalType": "bytes[]"
          },
          {
            "name": "descriptionHash",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "queue",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "quorum",
        "inputs": [
          {
            "name": "blockNumber",
            "type": "uint256",
            "internalType": "uint256"
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
        "type": "function",
        "name": "quorumDenominator",
        "inputs": [],
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
        "type": "function",
        "name": "quorumNumerator",
        "inputs": [
          {
            "name": "timepoint",
            "type": "uint256",
            "internalType": "uint256"
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
        "type": "function",
        "name": "quorumNumerator",
        "inputs": [],
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
        "type": "function",
        "name": "relay",
        "inputs": [
          {
            "name": "target",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "value",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          }
        ],
        "outputs": [],
        "stateMutability": "payable"
      },
      {
        "type": "function",
        "name": "setProposalThreshold",
        "inputs": [
          {
            "name": "newProposalThreshold",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "setVotingDelay",
        "inputs": [
          {
            "name": "newVotingDelay",
            "type": "uint48",
            "internalType": "uint48"
          }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "setVotingPeriod",
        "inputs": [
          {
            "name": "newVotingPeriod",
            "type": "uint32",
            "internalType": "uint32"
          }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "state",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "uint8",
            "internalType": "enum IGovernor.ProposalState"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "supportsInterface",
        "inputs": [
          {
            "name": "interfaceId",
            "type": "bytes4",
            "internalType": "bytes4"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "bool",
            "internalType": "bool"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "token",
        "inputs": [],
        "outputs": [
          {
            "name": "",
            "type": "address",
            "internalType": "contract IERC5805"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "updateQuorumNumerator",
        "inputs": [
          {
            "name": "newQuorumNumerator",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "version",
        "inputs": [],
        "outputs": [
          {
            "name": "",
            "type": "string",
            "internalType": "string"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "votingDelay",
        "inputs": [],
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
        "type": "function",
        "name": "votingPeriod",
        "inputs": [],
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
        "name": "EIP712DomainChanged",
        "inputs": [],
        "anonymous": False
      },
      {
        "type": "event",
        "name": "ProposalCanceled",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          }
        ],
        "anonymous": False
      },
      {
        "type": "event",
        "name": "ProposalCreated",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          },
          {
            "name": "proposer",
            "type": "address",
            "indexed": False,
            "internalType": "address"
          },
          {
            "name": "targets",
            "type": "address[]",
            "indexed": False,
            "internalType": "address[]"
          },
          {
            "name": "values",
            "type": "uint256[]",
            "indexed": False,
            "internalType": "uint256[]"
          },
          {
            "name": "signatures",
            "type": "string[]",
            "indexed": False,
            "internalType": "string[]"
          },
          {
            "name": "calldatas",
            "type": "bytes[]",
            "indexed": False,
            "internalType": "bytes[]"
          },
          {
            "name": "voteStart",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          },
          {
            "name": "voteEnd",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          },
          {
            "name": "description",
            "type": "string",
            "indexed": False,
            "internalType": "string"
          }
        ],
        "anonymous": False
      },
      {
        "type": "event",
        "name": "ProposalExecuted",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          }
        ],
        "anonymous": False
      },
      {
        "type": "event",
        "name": "ProposalQueued",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          },
          {
            "name": "etaSeconds",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          }
        ],
        "anonymous": False
      },
      {
        "type": "event",
        "name": "ProposalThresholdSet",
        "inputs": [
          {
            "name": "oldProposalThreshold",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          },
          {
            "name": "newProposalThreshold",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          }
        ],
        "anonymous": False
      },
      {
        "type": "event",
        "name": "QuorumNumeratorUpdated",
        "inputs": [
          {
            "name": "oldQuorumNumerator",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          },
          {
            "name": "newQuorumNumerator",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          }
        ],
        "anonymous": False
      },
      {
        "type": "event",
        "name": "VoteCast",
        "inputs": [
          {
            "name": "voter",
            "type": "address",
            "indexed": True,
            "internalType": "address"
          },
          {
            "name": "proposalId",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          },
          {
            "name": "support",
            "type": "uint8",
            "indexed": False,
            "internalType": "uint8"
          },
          {
            "name": "weight",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          },
          {
            "name": "reason",
            "type": "string",
            "indexed": False,
            "internalType": "string"
          }
        ],
        "anonymous": False
      },
      {
        "type": "event",
        "name": "VoteCastWithParams",
        "inputs": [
          {
            "name": "voter",
            "type": "address",
            "indexed": True,
            "internalType": "address"
          },
          {
            "name": "proposalId",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          },
          {
            "name": "support",
            "type": "uint8",
            "indexed": False,
            "internalType": "uint8"
          },
          {
            "name": "weight",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          },
          {
            "name": "reason",
            "type": "string",
            "indexed": False,
            "internalType": "string"
          },
          {
            "name": "params",
            "type": "bytes",
            "indexed": False,
            "internalType": "bytes"
          }
        ],
        "anonymous": False
      },
      {
        "type": "event",
        "name": "VotingDelaySet",
        "inputs": [
          {
            "name": "oldVotingDelay",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          },
          {
            "name": "newVotingDelay",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          }
        ],
        "anonymous": False
      },
      {
        "type": "event",
        "name": "VotingPeriodSet",
        "inputs": [
          {
            "name": "oldVotingPeriod",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          },
          {
            "name": "newVotingPeriod",
            "type": "uint256",
            "indexed": False,
            "internalType": "uint256"
          }
        ],
        "anonymous": False
      },
      {
        "type": "error",
        "name": "CheckpointUnorderedInsertion",
        "inputs": []
      },
      {
        "type": "error",
        "name": "FailedCall",
        "inputs": []
      },
      {
        "type": "error",
        "name": "GovernorAlreadyCastVote",
        "inputs": [
          {
            "name": "voter",
            "type": "address",
            "internalType": "address"
          }
        ]
      },
      {
        "type": "error",
        "name": "GovernorAlreadyQueuedProposal",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "type": "error",
        "name": "GovernorDisabledDeposit",
        "inputs": []
      },
      {
        "type": "error",
        "name": "GovernorInsufficientProposerVotes",
        "inputs": [
          {
            "name": "proposer",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "votes",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "threshold",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "type": "error",
        "name": "GovernorInvalidProposalLength",
        "inputs": [
          {
            "name": "targets",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "calldatas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "values",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "type": "error",
        "name": "GovernorInvalidQuorumFraction",
        "inputs": [
          {
            "name": "quorumNumerator",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "quorumDenominator",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "type": "error",
        "name": "GovernorInvalidSignature",
        "inputs": [
          {
            "name": "voter",
            "type": "address",
            "internalType": "address"
          }
        ]
      },
      {
        "type": "error",
        "name": "GovernorInvalidVoteParams",
        "inputs": []
      },
      {
        "type": "error",
        "name": "GovernorInvalidVoteType",
        "inputs": []
      },
      {
        "type": "error",
        "name": "GovernorInvalidVotingPeriod",
        "inputs": [
          {
            "name": "votingPeriod",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "type": "error",
        "name": "GovernorNonexistentProposal",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "type": "error",
        "name": "GovernorNotQueuedProposal",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "type": "error",
        "name": "GovernorOnlyExecutor",
        "inputs": [
          {
            "name": "account",
            "type": "address",
            "internalType": "address"
          }
        ]
      },
      {
        "type": "error",
        "name": "GovernorQueueNotImplemented",
        "inputs": []
      },
      {
        "type": "error",
        "name": "GovernorRestrictedProposer",
        "inputs": [
          {
            "name": "proposer",
            "type": "address",
            "internalType": "address"
          }
        ]
      },
      {
        "type": "error",
        "name": "GovernorUnableToCancel",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "account",
            "type": "address",
            "internalType": "address"
          }
        ]
      },
      {
        "type": "error",
        "name": "GovernorUnexpectedProposalState",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "current",
            "type": "uint8",
            "internalType": "enum IGovernor.ProposalState"
          },
          {
            "name": "expectedStates",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ]
      },
      {
        "type": "error",
        "name": "InvalidAccountNonce",
        "inputs": [
          {
            "name": "account",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "currentNonce",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "type": "error",
        "name": "InvalidShortString",
        "inputs": []
      },
      {
        "type": "error",
        "name": "SafeCastOverflowedUintDowncast",
        "inputs": [
          {
            "name": "bits",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "value",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "type": "error",
        "name": "StringTooLong",
        "inputs": [
          {
            "name": "str",
            "type": "string",
            "internalType": "string"
          }
        ]
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