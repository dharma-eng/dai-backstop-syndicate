<img src="https://raw.githubusercontent.com/backstop-syndicate/dai-backstop-syndicate/master/logos/BDS-logo-w-name.png" alt="DAI Backstop Syndicate" height="420px">

[![Build Status](https://github.com/backstop-syndicate/dai-backstop-syndicate/workflows/CI/badge.svg)](https://github.com/backstop-syndicate/dai-backstop-syndicate/actions) [![License: CC0-1.0](https://img.shields.io/badge/License-CC0%201.0-lightgrey.svg)](http://creativecommons.org/publicdomain/zero/1.0/)

# Backstop Syndicate for MakerDAO

## Abstract

A Community Effort to Ensure a Successful Auction of MKR

## Context

On Thursday, 12 March, the price of ETH fell precipitously. The price decline caused many vaults in the Multi-Collateral Dai system to become undercollateralized. Many of these undercollateralized loans were liquidated as expected. However, due to a combination of market panic, network congestion, an issue with the price oracle, and attention deficits, some of the vaults were liquidated in exchange for zero DAI. As a result, the Multi-Collateral Dai system currently has a negative surplus. To eliminate this negative surplus, MakerDAO plans to sell MKR tokens in exchange for DAI in a real-time auction to begin on Wednesday 18 March.

## [Proposal](https://docs.google.com/document/d/1miS-snhSYBKwjQHM1MOPnLZZl9i2gj3zTcvuQWecV2M/edit#)

We are proposing establishing a pooled auction contract that would give syndicate participants a way to participate in the auction process should the price of MKR (denominated in Dai) fall to, say, 100 DAI / MKR. Anyone could trigger an auction using pooled funds at the given price once the auctions begin, and all participants in the pool would be able to redeem the tokens they minted by supplying Dai for the equivalent Dai / MKR blend held by the pool.

This contract won’t be designed to provide liquidity for liquidations during flaps (exchanging MKR for DAI the other direction) or flips (exchanging DAI for a vault's collateral). This contract is designed to signal community support for MKR and act as a buyer of last resort during the upcoming MKR auction.

## Technical Implementation

The [`DaiBackstopSyndicate`](.//blob/master/contracts/syndicate/DaiBackstopSyndicate.sol) smart contract allows anyone to indicate support for the backstop by depositing Dai with the `enlist` function. This mints an ERC20 token called "DBSv1-100" to represent the share of pooled funds owned by the depositor. Anyone is free to `enlist` to the syndicate until the pool performs the first bid. This first bid is triggered automatically once MKR auctions reach a price point below 100 DAI/MKR. The syndicate will participate in all auctions until the Dai pool is exhausted. A holder of the ERC20 "DBSv1-100" pool token can call `defect` at anytime to withdraw a proportional amount of the pool's remaining Dai and MKR.

## Deployed Contract

<0x....>

## Group Chat

[Telegram](https://t.me/backstopsyndicate)

## Acknowledgements

Thank you to the following community members for contributions to this tool.

@0age | @thegostep | @PhABC | @epheph | @samczsun | @scott-l-e-w-i-s | @Neablis | @graemecode | @sambacha | @banteg
