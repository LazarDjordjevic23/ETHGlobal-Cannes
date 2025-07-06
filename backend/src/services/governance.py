"""
Governance service for creating and submitting governance proposals.
"""

from typing import Optional
from web3 import Web3
from eth_account import Account
from ..models import GovernanceProposal
from ..abis import GOVERNANCE_ABI

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
            estimated_gas = 50000000  # other chains gas
            # estimated_gas = 10440817951 # mantle gas
            estimated_cost = gas_price * estimated_gas
            
            print(f"👤 Account Address: {self.account.address}")
            print(f"💰 Account Balance: {balance / 1e18:.6f} ETH")
            print(f"⛽ Gas Price: {gas_price / 1e9:.2f} Gwei")
            print(f"🔥 Estimated Gas: {estimated_gas:,}")
            print(f"💸 Estimated Cost: {estimated_cost / 1e18:.6f} ETH")
            
            if balance < estimated_cost:
                shortage = estimated_cost - balance
                print(f"❌ Insufficient funds: Need {estimated_cost / 1e18:.6f} ETH, have {balance / 1e18:.6f} ETH")
                print(f"💰 Short by: {shortage / 1e18:.6f} ETH")
                print(f"🔗 Please send ETH to: {self.account.address}")
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
            
            # Sign transaction
            signed_tx = self.w3.eth.account.sign_transaction(tx, self.account.key)
            
            print("📤 Sending transaction...")
            # Send the raw transaction bytes directly
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            print(f"✅ Transaction sent: {self.w3.to_hex(tx_hash)}")
            return self.w3.to_hex(tx_hash)
            
        except Exception as e:
            print(f"❌ Error creating proposal: {str(e)}")
            return None
    
    def execute_proposal(self, governance_address: str, targets: list, values: list, calldatas: list, description_hash: bytes) -> Optional[str]:
        """Execute a governance proposal"""
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
                shortage = estimated_cost - balance
                print(f"❌ Insufficient funds: Need {estimated_cost / 1e18:.6f} ETH, have {balance / 1e18:.6f} ETH")
                print(f"💰 Short by: {shortage / 1e18:.6f} ETH")
                print(f"🔗 Please send ETH to: {self.account.address}")
                return None
            
            # Build transaction
            tx = governance_contract.functions.execute(
                targets,
                values,
                calldatas,
                description_hash
            ).build_transaction({
                'from': self.account.address,
                'gas': estimated_gas,
                'gasPrice': gas_price,
                'nonce': self.w3.eth.get_transaction_count(self.account.address)
            })
            
            # Sign transaction
            signed_tx = self.w3.eth.account.sign_transaction(tx, self.account.key)
            
            print("📤 Sending execution transaction...")
            # Send the raw transaction bytes directly
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            print(f"✅ Execution transaction sent: {self.w3.to_hex(tx_hash)}")
            return self.w3.to_hex(tx_hash)
            
        except Exception as e:
            print(f"❌ Error executing proposal: {str(e)}")
            return None 