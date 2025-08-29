# Algorand Decentralization: Online Stake Analysis

This project provides an easy-to-understand analysis of Algorand decentralization.
It analyzes the network's online stake.
This includes native staking as well as third-party staking solutions like [Valar](https://stake.valar.solutions/) peer-to-peer staking, [Reti](https://reti.nodely.io/) pools, and liquid staking tokens (LSTs) from [Tinyman](https://app.tinyman.org/liquid-stake) (tALGO) and [Folks Finance](https://app.folks.finance/liquid-staking) (xALGO).

Users can explore and gain insights into who is operating the stake and through what means, who controls the stake, and how many users each staking solution or a node operator has.
This enables users to make informed decisions when selecting a staking solution or a node operator, contributing to increased network decentralization.

Identification of node operators and stake owners is based on publicly available data.
Unless explicitly identified, accounts are assumed to be owned and operated by distinct, anonymous entities.
Tracking of ownership of ALGO is currently done only up to the first-level, i.e. an account is staking directly (level 0) via native staking or owns LSTs (level 1). It is not tracked for example who owns LSTs that are used within liquidity pools (LPs) (level 2).

The majority of data is fetched directly from the blockchain i.e. there is no dedicated backend or trust needed.
Some third-party APIs from [Nodely](https://nodely.io/) are used to speed up data fetching.

## Usage

The project is publicly accessible at https://decentralization.valar.solutions/

You can run the project yourself:

1. Install Node.js
2. Clone this repository locally
3. Copy `.env.template` to `.env`
4. Install dependencies with `npm install`
5. Run the project with `npm run dev`

## Contributing

Contributions that expand on the quality of the analysis are welcome!
This includes identifying known node operators and stake owners.
When identifying accounts, please provide proof for the claims made.

## Potential Improvements

- Visualize how many users use multiple staking solutions and operators.
- Integrate other staking solutions:
  - [Myth Finance](https://myth.finance/dualSTAKE)
  - [CompaX](https://app.compx.io/staking-pools-pera) (cALGO)
  - [Messina](https://messina.one/liquid-staking) (mALGO)
  - [Pact](https://www.pact.fi/) LP pools
- Add links to a blockchain explorer for users to simply find more details about accounts.
- Expand the analysis by including NFDs as pseudonymous identities.
- Identify more accounts.
- Add details for each staking position of a user.
- Include performance analysis.

## Disclaimer

This product is provided as-is with no guarantees or warranties.
All information is for educational and informational purposes only.
Nothing regarding this product constitutes financial, legal, or investment advice.
Always do your own research before making decisions.
All analysis is based on best-effort methodologies and the data available.
Unless explicitly identified through public data or known affiliations, accounts are assumed to be owned and operated by distinct, anonymous entities.
Users are encouraged to independently verify findings and consider the assumptions and limitations when interpreting the results.

© 2025 Valar Solutions GmbH
