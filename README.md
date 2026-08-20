# Vault Challenge

An Anchor-based SOL vault program built for the Turbin3 pre-req task. Users can deposit and withdraw SOL from a personal PDA-controlled vault, and withdrawing triggers a Cross-Program Invocation (CPI) into the Turbin3 registration program to record the caller's GitHub username on-chain.

## Program

- **Program ID (devnet):** `9xEpQgvbxVmswieYbQSe8P6z3KxSvSxzCQDxndjGr1vv`
- **Cluster:** Devnet
- **Explorer:** [View program on Solana Explorer](https://explorer.solana.com/address/9xEpQgvbxVmswieYbQSe8P6z3KxSvSxzCQDxndjGr1vv?cluster=devnet)

## Accounts

| Account | Type | Seeds | Purpose |
|---|---|---|---|
| `VaultState` | PDA | `["state", user]` | Stores vault + state bumps |
| `Vault` | PDA (`SystemAccount`) | `["vault", vault_state]` | Holds the deposited SOL |
| `Application account` | PDA (external, registration program) | `["prereqs", user]` | Records the user's GitHub registration |

## Instructions

| Instruction | Description |
|---|---|
| `initialize` | Creates `VaultState` for the caller |
| `deposit` | Transfers SOL from `user` → `vault` |
| `withdraw` | Transfers SOL from `vault` → `user`, then performs a CPI into the registration program to record the caller's GitHub username |
| `close` | Empties the vault back to `user` and closes `VaultState` |

## Test Run (Devnet)

Deployed and tested against devnet with `anchor test --provider.cluster devnet`.

**Deploy transaction:**
[`5ACueEJXugMbQNEZbhZnCh22bpx47E37dn7p7aRdFz6dzq2DfsByFB5AED7nWKx7njoUvytsePtjbSudeY1tkQRp`](https://explorer.solana.com/tx/5ACueEJXugMbQNEZbhZnCh22bpx47E37dn7p7aRdFz6dzq2DfsByFB5AED7nWKx7njoUvytsePtjbSudeY1tkQRp?cluster=devnet)

| Test | Signature | Explorer |
|---|---|---|
| ✅ Initialize the vault | `4wW1u5EQQNHknKR8gVhaQAhBZrspnRSiLzcwSviRQDF2dJLEUg7v5KzLBgWL2eWubPiD9C6L46UK99GsW6wYnFRd` | [View](https://explorer.solana.com/tx/4wW1u5EQQNHknKR8gVhaQAhBZrspnRSiLzcwSviRQDF2dJLEUg7v5KzLBgWL2eWubPiD9C6L46UK99GsW6wYnFRd?cluster=devnet) |
| ✅ Deposit 1 SOL into the vault | `3ksEjtSR2rUoU49EKXs5ZYyNTAP57QesLSJUFwDqx1pwyqaDCXm87wx3wJ6rHDL69u7T9Ub9JLTc8aSbVMuJZT8v` | [View](https://explorer.solana.com/tx/3ksEjtSR2rUoU49EKXs5ZYyNTAP57QesLSJUFwDqx1pwyqaDCXm87wx3wJ6rHDL69u7T9Ub9JLTc8aSbVMuJZT8v?cluster=devnet) |
| ✅ Withdraw 0.5 SOL from the vault (+ registration CPI) | `3d3Cv7p8m4stKP9sePMtcUiQdaf1KomBUjE3Dfzct36dZvRPcyWC7VwfyuvTEp6fEQcwpKM9EbJCEvAumQcdNXaq` | [View](https://explorer.solana.com/tx/3d3Cv7p8m4stKP9sePMtcUiQdaf1KomBUjE3Dfzct36dZvRPcyWC7VwfyuvTEp6fEQcwpKM9EbJCEvAumQcdNXaq?cluster=devnet) |
| ✅ Close the vault and withdraw all funds | `4nyhM1NvBSZxumfW7PAFmTdNAnhMVgSv8FFRnZcENUBsBJb5Bv4s9eCmCpMPs8vdEBq1U9q3Lqof3XXLdFocDwU3` | [View](https://explorer.solana.com/tx/4nyhM1NvBSZxumfW7PAFmTdNAnhMVgSv8FFRnZcENUBsBJb5Bv4s9eCmCpMPs8vdEBq1U9q3Lqof3XXLdFocDwU3?cluster=devnet) |

All 4 tests passed.

## Setup

```bash
# Install JS dependencies
npm install

# Build the program
anchor build

# Deploy + run tests on devnet
anchor test --provider.cluster devnet --skip-local-validator
```

## Tech Stack

- Anchor `0.31.1`
- Solana CLI
- TypeScript / ts-mocha
