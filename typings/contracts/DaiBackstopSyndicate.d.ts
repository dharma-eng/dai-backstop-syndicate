/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractTransaction, EventFilter, Signer } from "ethers";
import { Listener, Provider } from "ethers/providers";
import { Arrayish, BigNumber, BigNumberish, Interface } from "ethers/utils";
import {
  TransactionOverrides,
  TypedEventDescription,
  TypedFunctionDescription
} from ".";

interface DaiBackstopSyndicateInterface extends Interface {
  functions: {
    acceptOwnership: TypedFunctionDescription<{ encode([]: []): string }>;

    allowance: TypedFunctionDescription<{
      encode([owner, spender]: [string, string]): string;
    }>;

    approve: TypedFunctionDescription<{
      encode([spender, value]: [string, BigNumberish]): string;
    }>;

    balanceOf: TypedFunctionDescription<{
      encode([account]: [string]): string;
    }>;

    cancelOwnershipTransfer: TypedFunctionDescription<{
      encode([]: []): string;
    }>;

    decimals: TypedFunctionDescription<{ encode([]: []): string }>;

    decreaseAllowance: TypedFunctionDescription<{
      encode([spender, subtractedValue]: [string, BigNumberish]): string;
    }>;

    getAuctionInformation: TypedFunctionDescription<{ encode([]: []): string }>;

    getCurrentBid: TypedFunctionDescription<{
      encode([auctionID]: [BigNumberish]): string;
    }>;

    getFlopperAddress: TypedFunctionDescription<{ encode([]: []): string }>;

    getTotalNumberOfAuctions: TypedFunctionDescription<{
      encode([]: []): string;
    }>;

    increaseAllowance: TypedFunctionDescription<{
      encode([spender, addedValue]: [string, BigNumberish]): string;
    }>;

    isEnabled: TypedFunctionDescription<{ encode([]: []): string }>;

    isOwner: TypedFunctionDescription<{ encode([]: []): string }>;

    name: TypedFunctionDescription<{ encode([]: []): string }>;

    owner: TypedFunctionDescription<{ encode([]: []): string }>;

    symbol: TypedFunctionDescription<{ encode([]: []): string }>;

    totalSupply: TypedFunctionDescription<{ encode([]: []): string }>;

    transfer: TypedFunctionDescription<{
      encode([recipient, amount]: [string, BigNumberish]): string;
    }>;

    transferFrom: TypedFunctionDescription<{
      encode([sender, recipient, amount]: [
        string,
        string,
        BigNumberish
      ]): string;
    }>;

    transferOwnership: TypedFunctionDescription<{
      encode([newOwner]: [string]): string;
    }>;

    enlist: TypedFunctionDescription<{
      encode([daiAmount]: [BigNumberish]): string;
    }>;

    defect: TypedFunctionDescription<{
      encode([backstopTokenAmount]: [BigNumberish]): string;
    }>;

    enterAuction: TypedFunctionDescription<{
      encode([auctionId]: [BigNumberish]): string;
    }>;

    finalizeAuction: TypedFunctionDescription<{
      encode([auctionId]: [BigNumberish]): string;
    }>;

    ceaseFire: TypedFunctionDescription<{ encode([]: []): string }>;

    getStatus: TypedFunctionDescription<{ encode([]: []): string }>;

    getDaiBalance: TypedFunctionDescription<{ encode([]: []): string }>;

    getActiveAuctions: TypedFunctionDescription<{ encode([]: []): string }>;
  };

  events: {
    Approval: TypedEventDescription<{
      encodeTopics([owner, spender, value]: [
        string | null,
        string | null,
        null
      ]): string[];
    }>;

    AuctionEntered: TypedEventDescription<{
      encodeTopics([auctionId, mkrAsk, daiBid]: [null, null, null]): string[];
    }>;

    AuctionFinalized: TypedEventDescription<{
      encodeTopics([auctionId]: [null]): string[];
    }>;

    OwnershipTransferred: TypedEventDescription<{
      encodeTopics([previousOwner, newOwner]: [
        string | null,
        string | null
      ]): string[];
    }>;

    Transfer: TypedEventDescription<{
      encodeTopics([from, to, value]: [
        string | null,
        string | null,
        null
      ]): string[];
    }>;
  };
}

export class DaiBackstopSyndicate extends Contract {
  connect(signerOrProvider: Signer | Provider | string): DaiBackstopSyndicate;
  attach(addressOrName: string): DaiBackstopSyndicate;
  deployed(): Promise<DaiBackstopSyndicate>;

  on(event: EventFilter | string, listener: Listener): DaiBackstopSyndicate;
  once(event: EventFilter | string, listener: Listener): DaiBackstopSyndicate;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): DaiBackstopSyndicate;
  removeAllListeners(eventName: EventFilter | string): DaiBackstopSyndicate;
  removeListener(eventName: any, listener: Listener): DaiBackstopSyndicate;

  interface: DaiBackstopSyndicateInterface;

  functions: {
    acceptOwnership(
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    allowance(owner: string, spender: string): Promise<BigNumber>;

    approve(
      spender: string,
      value: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    balanceOf(account: string): Promise<BigNumber>;

    cancelOwnershipTransfer(
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    decimals(): Promise<number>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    getAuctionInformation(): Promise<{
      bidIncrement: BigNumber;
      repriceIncrement: BigNumber;
      bidDuration: BigNumber;
      auctionDuration: BigNumber;
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
      3: BigNumber;
    }>;

    getCurrentBid(
      auctionID: BigNumberish
    ): Promise<{
      amountDAI: BigNumber;
      amountMKR: BigNumber;
      bidder: string;
      bidDeadline: number;
      auctionDeadline: number;
      0: BigNumber;
      1: BigNumber;
      2: string;
      3: number;
      4: number;
    }>;

    getFlopperAddress(): Promise<string>;

    getTotalNumberOfAuctions(): Promise<BigNumber>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    isEnabled(): Promise<boolean>;

    isOwner(): Promise<boolean>;

    name(): Promise<string>;

    owner(): Promise<string>;

    symbol(): Promise<string>;

    totalSupply(): Promise<BigNumber>;

    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    enlist(
      daiAmount: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    defect(
      backstopTokenAmount: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    enterAuction(
      auctionId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    finalizeAuction(
      auctionId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    ceaseFire(overrides?: TransactionOverrides): Promise<ContractTransaction>;

    getStatus(): Promise<number>;

    getDaiBalance(): Promise<BigNumber>;

    getActiveAuctions(): Promise<BigNumber[]>;
  };

  acceptOwnership(
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  allowance(owner: string, spender: string): Promise<BigNumber>;

  approve(
    spender: string,
    value: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  balanceOf(account: string): Promise<BigNumber>;

  cancelOwnershipTransfer(
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  decimals(): Promise<number>;

  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  getAuctionInformation(): Promise<{
    bidIncrement: BigNumber;
    repriceIncrement: BigNumber;
    bidDuration: BigNumber;
    auctionDuration: BigNumber;
    0: BigNumber;
    1: BigNumber;
    2: BigNumber;
    3: BigNumber;
  }>;

  getCurrentBid(
    auctionID: BigNumberish
  ): Promise<{
    amountDAI: BigNumber;
    amountMKR: BigNumber;
    bidder: string;
    bidDeadline: number;
    auctionDeadline: number;
    0: BigNumber;
    1: BigNumber;
    2: string;
    3: number;
    4: number;
  }>;

  getFlopperAddress(): Promise<string>;

  getTotalNumberOfAuctions(): Promise<BigNumber>;

  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  isEnabled(): Promise<boolean>;

  isOwner(): Promise<boolean>;

  name(): Promise<string>;

  owner(): Promise<string>;

  symbol(): Promise<string>;

  totalSupply(): Promise<BigNumber>;

  transfer(
    recipient: string,
    amount: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  transferFrom(
    sender: string,
    recipient: string,
    amount: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  enlist(
    daiAmount: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  defect(
    backstopTokenAmount: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  enterAuction(
    auctionId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  finalizeAuction(
    auctionId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  ceaseFire(overrides?: TransactionOverrides): Promise<ContractTransaction>;

  getStatus(): Promise<number>;

  getDaiBalance(): Promise<BigNumber>;

  getActiveAuctions(): Promise<BigNumber[]>;

  filters: {
    Approval(
      owner: string | null,
      spender: string | null,
      value: null
    ): EventFilter;

    AuctionEntered(auctionId: null, mkrAsk: null, daiBid: null): EventFilter;

    AuctionFinalized(auctionId: null): EventFilter;

    OwnershipTransferred(
      previousOwner: string | null,
      newOwner: string | null
    ): EventFilter;

    Transfer(from: string | null, to: string | null, value: null): EventFilter;
  };

  estimate: {
    acceptOwnership(): Promise<BigNumber>;

    allowance(owner: string, spender: string): Promise<BigNumber>;

    approve(spender: string, value: BigNumberish): Promise<BigNumber>;

    balanceOf(account: string): Promise<BigNumber>;

    cancelOwnershipTransfer(): Promise<BigNumber>;

    decimals(): Promise<BigNumber>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish
    ): Promise<BigNumber>;

    getAuctionInformation(): Promise<BigNumber>;

    getCurrentBid(auctionID: BigNumberish): Promise<BigNumber>;

    getFlopperAddress(): Promise<BigNumber>;

    getTotalNumberOfAuctions(): Promise<BigNumber>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish
    ): Promise<BigNumber>;

    isEnabled(): Promise<BigNumber>;

    isOwner(): Promise<BigNumber>;

    name(): Promise<BigNumber>;

    owner(): Promise<BigNumber>;

    symbol(): Promise<BigNumber>;

    totalSupply(): Promise<BigNumber>;

    transfer(recipient: string, amount: BigNumberish): Promise<BigNumber>;

    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish
    ): Promise<BigNumber>;

    transferOwnership(newOwner: string): Promise<BigNumber>;

    enlist(daiAmount: BigNumberish): Promise<BigNumber>;

    defect(backstopTokenAmount: BigNumberish): Promise<BigNumber>;

    enterAuction(auctionId: BigNumberish): Promise<BigNumber>;

    finalizeAuction(auctionId: BigNumberish): Promise<BigNumber>;

    ceaseFire(): Promise<BigNumber>;

    getStatus(): Promise<BigNumber>;

    getDaiBalance(): Promise<BigNumber>;

    getActiveAuctions(): Promise<BigNumber>;
  };
}
