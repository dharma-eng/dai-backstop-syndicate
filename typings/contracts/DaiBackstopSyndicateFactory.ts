/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractFactory, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { UnsignedTransaction } from "ethers/utils/transaction";

import { DaiBackstopSyndicate } from "./DaiBackstopSyndicate";

export class DaiBackstopSyndicateFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    dai_: string,
    mkr_: string,
    daiJoin_: string,
    vat_: string,
    flopper_: string
  ): Promise<DaiBackstopSyndicate> {
    return super.deploy(dai_, mkr_, daiJoin_, vat_, flopper_) as Promise<
      DaiBackstopSyndicate
    >;
  }
  getDeployTransaction(
    dai_: string,
    mkr_: string,
    daiJoin_: string,
    vat_: string,
    flopper_: string
  ): UnsignedTransaction {
    return super.getDeployTransaction(dai_, mkr_, daiJoin_, vat_, flopper_);
  }
  attach(address: string): DaiBackstopSyndicate {
    return super.attach(address) as DaiBackstopSyndicate;
  }
  connect(signer: Signer): DaiBackstopSyndicateFactory {
    return super.connect(signer) as DaiBackstopSyndicateFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DaiBackstopSyndicate {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as DaiBackstopSyndicate;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "dai_",
        type: "address"
      },
      {
        internalType: "address",
        name: "mkr_",
        type: "address"
      },
      {
        internalType: "address",
        name: "daiJoin_",
        type: "address"
      },
      {
        internalType: "address",
        name: "vat_",
        type: "address"
      },
      {
        internalType: "address",
        name: "flopper_",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "auctionId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mkrAsk",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "daiBid",
        type: "uint256"
      }
    ],
    name: "AuctionEntered",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "auctionId",
        type: "uint256"
      }
    ],
    name: "AuctionFinalized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256"
      }
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getAuctionInformation",
    outputs: [
      {
        internalType: "uint256",
        name: "bidIncrement",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "repriceIncrement",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "bidDuration",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "auctionDuration",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "auctionID",
        type: "uint256"
      }
    ],
    name: "getCurrentBid",
    outputs: [
      {
        internalType: "uint256",
        name: "amountDAI",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amountMKR",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "bidder",
        type: "address"
      },
      {
        internalType: "uint48",
        name: "bidDeadline",
        type: "uint48"
      },
      {
        internalType: "uint48",
        name: "auctionDeadline",
        type: "uint48"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getDaiAddress",
    outputs: [
      {
        internalType: "address",
        name: "dai",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getFlopperAddress",
    outputs: [
      {
        internalType: "address",
        name: "flopper",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getMKRAddress",
    outputs: [
      {
        internalType: "address",
        name: "mkr",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getTotalNumberOfAuctions",
    outputs: [
      {
        internalType: "uint256",
        name: "auctionID",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256"
      }
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isEnabled",
    outputs: [
      {
        internalType: "bool",
        name: "status",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "daiAmount",
        type: "uint256"
      }
    ],
    name: "enlist",
    outputs: [
      {
        internalType: "uint256",
        name: "backstopTokensMinted",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "backstopTokenAmount",
        type: "uint256"
      }
    ],
    name: "defect",
    outputs: [
      {
        internalType: "uint256",
        name: "daiRedeemed",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "mkrRedeemed",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "auctionId",
        type: "uint256"
      }
    ],
    name: "enterAuction",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "auctionId",
        type: "uint256"
      }
    ],
    name: "finalizeAuction",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getStatus",
    outputs: [
      {
        internalType: "enum IDaiBackstopSyndicate.Status",
        name: "status",
        type: "uint8"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getActiveAuctions",
    outputs: [
      {
        internalType: "uint256[]",
        name: "activeAuctions",
        type: "uint256[]"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051611d53380380611d53833981810160405260a081101561003357600080fd5b50805160208201516040808401516060850151608090950151600080546001600160a01b03199081166001600160a01b038085169190911783556004805460ff19168155600780548416838b16179055600880548416838a161790556009805484168388161790819055600a8054909416838c16179384905587516328ec8bf160e21b815290831691810191909152955197989697949695939491169263a3b22fc492602480830193919282900301818387803b1580156100f357600080fd5b505af1158015610107573d6000803e3d6000fd5b50506007546009546040805163095ea7b360e01b81526001600160a01b0392831660048201526000196024820152905191909216935063095ea7b3925060448083019260209291908290030181600087803b15801561016557600080fd5b505af1158015610179573d6000803e3d6000fd5b505050506040513d602081101561018f57600080fd5b50505050505050611bae806101a56000396000f3fe608060405234801561001057600080fd5b50600436106101375760003560e01c806370a08231116100b8578063c49c2eb61161007c578063c49c2eb61461035f578063cf44b5d514610367578063da4e364f146103bf578063dd62ed3e1461041a578063e808386314610448578063e918ad911461046757610137565b806370a08231146102a35780638a539972146102c9578063a457c2d7146102ff578063a9059cbb1461032b578063bafebc6f1461035757610137565b80633d8b7894116100ff5780633d8b78941461021c5780633f1fc6781461023957806345a89214146102675780634e69d5601461026f5780636aa633b61461029b57610137565b8063095ea7b31461013c57806318160ddd1461017c57806323b872dd1461019657806333187dbb146101cc57806339509351146101f0575b600080fd5b6101686004803603604081101561015257600080fd5b506001600160a01b038135169060200135610484565b604080519115158252519081900360200190f35b61018461049b565b60408051918252519081900360200190f35b610168600480360360608110156101ac57600080fd5b506001600160a01b038135811691602081013590911690604001356104a1565b6101d46104f8565b604080516001600160a01b039092168252519081900360200190f35b6101686004803603604081101561020657600080fd5b506001600160a01b038135169060200135610578565b6101846004803603602081101561023257600080fd5b50356105b4565b610241610742565b604080519485526020850193909352838301919091526060830152519081900360800190f35b6101d461092e565b61027761097d565b6040518082600181111561028757fe5b60ff16815260200191505060405180910390f35b610168610986565b610184600480360360208110156102b957600080fd5b50356001600160a01b0316610a17565b6102e6600480360360208110156102df57600080fd5b5035610a32565b6040805192835260208301919091528051918290030190f35b6101686004803603604081101561031557600080fd5b506001600160a01b038135169060200135610d54565b6101686004803603604081101561034157600080fd5b506001600160a01b038135169060200135610d90565b6101d4610d9d565b610184610dac565b61036f610dfb565b60408051602080825283518183015283519192839290830191858101910280838360005b838110156103ab578181015183820152602001610393565b505050509050019250505060405180910390f35b6103dc600480360360208110156103d557600080fd5b5035610e07565b6040805195865260208601949094526001600160a01b039092168484015265ffffffffffff9081166060850152166080830152519081900360a00190f35b6101846004803603604081101561043057600080fd5b506001600160a01b0381358116916020013516610eac565b6104656004803603602081101561045e57600080fd5b5035610ed7565b005b6104656004803603602081101561047d57600080fd5b5035610faa565b60006104913384846110b4565b5060015b92915050565b60035490565b60006104ae8484846111a0565b6001600160a01b0384166000908152600260209081526040808320338085529252909120546104ee9186916104e9908663ffffffff6112e416565b6110b4565b5060019392505050565b60008060009054906101000a90046001600160a01b03166001600160a01b03166336569e776040518163ffffffff1660e01b815260040160206040518083038186803b15801561054757600080fd5b505afa15801561055b573d6000803e3d6000fd5b505050506040513d602081101561057157600080fd5b5051905090565b3360008181526002602090815260408083206001600160a01b038716845290915281205490916104919185906104e9908663ffffffff61134116565b60008060045460ff1660018111156105c857fe5b146106045760405162461bcd60e51b8152600401808060200182810382526055815260200180611a9a6055913960600191505060405180910390fd5b600754604080516323b872dd60e01b81523360048201523060248201526044810185905290516001600160a01b03909216916323b872dd916064808201926020929091908290030181600087803b15801561065e57600080fd5b505af1158015610672573d6000803e3d6000fd5b505050506040513d602081101561068857600080fd5b50516106c55760405162461bcd60e51b8152600401808060200182810382526047815260200180611a176047913960600191505060405180910390fd5b60095460408051633b4da69f60e01b81523060048201526024810185905290516001600160a01b0390921691633b4da69f9160448082019260009290919082900301818387803b15801561071857600080fd5b505af115801561072c573d6000803e3d6000fd5b5050505081905061073d33826113a2565b919050565b6000806000806000809054906101000a90046001600160a01b03166001600160a01b0316637d780d826040518163ffffffff1660e01b815260040160206040518083038186803b15801561079557600080fd5b505afa1580156107a9573d6000803e3d6000fd5b505050506040513d60208110156107bf57600080fd5b5051600054604080516324d8499b60e21b815290516001600160a01b0390921691639361266c91600480820192602092909190829003018186803b15801561080657600080fd5b505afa15801561081a573d6000803e3d6000fd5b505050506040513d602081101561083057600080fd5b505160005460408051634e8b1dd560e01b815290516001600160a01b0390921691634e8b1dd591600480820192602092909190829003018186803b15801561087757600080fd5b505afa15801561088b573d6000803e3d6000fd5b505050506040513d60208110156108a157600080fd5b50516000546040805163cfc4af5560e01b815290516001600160a01b039092169163cfc4af5591600480820192602092909190829003018186803b1580156108e857600080fd5b505afa1580156108fc573d6000803e3d6000fd5b505050506040513d602081101561091257600080fd5b5051929791965065ffffffffffff908116955090911692509050565b60008060009054906101000a90046001600160a01b03166001600160a01b0316637bd2bea76040518163ffffffff1660e01b815260040160206040518083038186803b15801561054757600080fd5b60045460ff1690565b60008060009054906101000a90046001600160a01b03166001600160a01b031663957aa58c6040518163ffffffff1660e01b815260040160206040518083038186803b1580156109d557600080fd5b505afa1580156109e9573d6000803e3d6000fd5b505050506040513d60208110156109ff57600080fd5b5051600114610a0f576000610a12565b60015b905090565b6001600160a01b031660009081526001602052604090205490565b6000806000610a66610a4261049b565b610a5a86670de0b6b3a764000063ffffffff61149416565b9063ffffffff6114ed16565b9050610a723385611557565b6000610a7c611632565b600a5460408051633612d9a360e11b815230600482015290519293506000926b033b2e3c9fd0803ce8000000926001600160a01b031691636c25b346916024808301926020929190829003018186803b158015610ad857600080fd5b505afa158015610aec573d6000803e3d6000fd5b505050506040513d6020811015610b0257600080fd5b505181610b0b57fe5b0490506000610b20838363ffffffff61134116565b600854604080516370a0823160e01b815230600482015290519293506000926001600160a01b03909216916370a0823191602480820192602092909190829003018186803b158015610b7157600080fd5b505afa158015610b85573d6000803e3d6000fd5b505050506040513d6020811015610b9b57600080fd5b50519050670de0b6b3a7640000610bb8838763ffffffff61149416565b81610bbf57fe5b049650670de0b6b3a7640000610bdb828763ffffffff61149416565b81610be257fe5b04955082871115610c245760405162461bcd60e51b81526004018080602001828103825260428152602001806119476042913960600191505060405180910390fd5b6009546040805163ef693bed60e01b8152336004820152602481018a905290516001600160a01b039092169163ef693bed9160448082019260009290919082900301818387803b158015610c7757600080fd5b505af1158015610c8b573d6000803e3d6000fd5b50506008546040805163a9059cbb60e01b8152336004820152602481018b905290516001600160a01b03909216935063a9059cbb92506044808201926020929091908290030181600087803b158015610ce357600080fd5b505af1158015610cf7573d6000803e3d6000fd5b505050506040513d6020811015610d0d57600080fd5b5051610d4a5760405162461bcd60e51b81526004018080602001828103825260338152602001806119e46033913960400191505060405180910390fd5b5050505050915091565b3360008181526002602090815260408083206001600160a01b038716845290915281205490916104919185906104e9908663ffffffff6112e416565b60006104913384846111a0565b6000546001600160a01b031690565b60008060009054906101000a90046001600160a01b03166001600160a01b031663cfdd33026040518163ffffffff1660e01b815260040160206040518083038186803b15801561054757600080fd5b6060610a1260056116a8565b6000805460408051634423c5f160e01b815260048101859052905183928392839283926001600160a01b031691634423c5f19160248083019260a0929190829003018186803b158015610e5957600080fd5b505afa158015610e6d573d6000803e3d6000fd5b505050506040513d60a0811015610e8357600080fd5b508051602082015160408301516060840151608090940151929a91995097509195509350915050565b6001600160a01b03918216600090815260026020908152604080832093909416825291909152205490565b610ee860058263ffffffff61172e16565b610f235760405162461bcd60e51b815260040180806020018281038252603c815260200180611a5e603c913960400191505060405180910390fd5b600080610f2f83610e07565b945050935050508065ffffffffffff16600014610f60576001600160a01b038216301415610f6057610f6083611743565b610f7160058463ffffffff6117a616565b506040805184815290517f2d7633a748a750b559b97738629efd586b561319b152bb42ba14d590706d31da9181900360200190a1505050565b610fbb60058263ffffffff61172e16565b15610ff75760405162461bcd60e51b81526004018080602001828103825260398152602001806119896039913960400191505060405180910390fd5b600061100282610e07565b505050509050600060646b033b2e3c9fd0803ce8000000838161102157fe5b048161102957fe5b04905061103783828461186f565b600160045460ff16600181111561104a57fe5b1461105d576004805460ff191660011790555b61106e60058463ffffffff6118e216565b50604080518481526020810183905280820184905290517f35f50010a71a711fbfb0ada2814c5caf05bf153ccea88acca671ab6a5615d7c79181900360600190a1505050565b6001600160a01b0383166110f95760405162461bcd60e51b8152600401808060200182810382526024815260200180611b566024913960400191505060405180910390fd5b6001600160a01b03821661113e5760405162461bcd60e51b81526004018080602001828103825260228152602001806119c26022913960400191505060405180910390fd5b6001600160a01b03808416600081815260026020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b6001600160a01b0383166111e55760405162461bcd60e51b8152600401808060200182810382526025815260200180611b316025913960400191505060405180910390fd5b6001600160a01b03821661122a5760405162461bcd60e51b81526004018080602001828103825260238152602001806119246023913960400191505060405180910390fd5b6001600160a01b038316600090815260016020526040902054611253908263ffffffff6112e416565b6001600160a01b038085166000908152600160205260408082209390935590841681522054611288908263ffffffff61134116565b6001600160a01b0380841660008181526001602090815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b60008282111561133b576040805162461bcd60e51b815260206004820152601e60248201527f536166654d6174683a207375627472616374696f6e206f766572666c6f770000604482015290519081900360640190fd5b50900390565b60008282018381101561139b576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b6001600160a01b0382166113fd576040805162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015290519081900360640190fd5b600354611410908263ffffffff61134116565b6003556001600160a01b03821660009081526001602052604090205461143c908263ffffffff61134116565b6001600160a01b03831660008181526001602090815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b6000826114a357506000610495565b828202828482816114b057fe5b041461139b5760405162461bcd60e51b8152600401808060200182810382526021815260200180611aef6021913960400191505060405180910390fd5b6000808211611543576040805162461bcd60e51b815260206004820152601a60248201527f536166654d6174683a206469766973696f6e206279207a65726f000000000000604482015290519081900360640190fd5b600082848161154e57fe5b04949350505050565b6001600160a01b03821661159c5760405162461bcd60e51b8152600401808060200182810382526021815260200180611b106021913960400191505060405180910390fd5b6003546115af908263ffffffff6112e416565b6003556001600160a01b0382166000908152600160205260409020546115db908263ffffffff6112e416565b6001600160a01b0383166000818152600160209081526040808320949094558351858152935191937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929081900390910190a35050565b6000606061164060056116a8565b9050600080805b83518110156116a15761166c84828151811061165f57fe5b6020026020010151610e07565b50929550935050506001600160a01b038216301415611699576b033b2e3c9fd0803ce80000008304850194505b600101611647565b5050505090565b60608082600101805490506040519080825280602002602001820160405280156116dc578160200160208202803883390190505b50905060005b6001840154811015611727578360010181815481106116fd57fe5b906000526020600020015482828151811061171457fe5b60209081029190910101526001016116e2565b5092915050565b60009081526020919091526040902054151590565b600080546040805163c959c42b60e01b81526004810185905290516001600160a01b039092169263c959c42b9260248084019382900301818387803b15801561178b57600080fd5b505af115801561179f573d6000803e3d6000fd5b5050505050565b60006117b2838361172e565b15611867576000828152602084905260409020546001840154600019918201910180821461182a5760008560010182815481106117eb57fe5b906000526020600020015490508086600101848154811061180857fe5b6000918252602080832090910192909255918252869052604090206001830190555b6000848152602086905260408120556001850180548061184657fe5b60019003818190600052602060002001600090559055600192505050610495565b506000610495565b6000805460408051632ff9d1c160e11b815260048101879052602481018690526044810185905290516001600160a01b0390921692635ff3a3829260648084019382900301818387803b1580156118c557600080fd5b505af11580156118d9573d6000803e3d6000fd5b50505050505050565b60006118ee838361172e565b61186757506001808301805480830182556000828152602080822090920185905591548483529085905260409091205561049556fe45524332303a207472616e7366657220746f20746865207a65726f20616464726573734461694261636b73746f7053796e6469636174652f6465666563743a20496e73756666696369656e74204461692028696e2075736520696e2061756374696f6e73294461694261636b73746f7053796e6469636174652f656e74657241756374696f6e3a2041756374696f6e20616c72656164792061637469766545524332303a20617070726f766520746f20746865207a65726f20616464726573734461694261636b73746f7053796e6469636174652f6465666563743a204d4b5220726564656d7074696f6e206661696c65642e4461694261636b73746f7053796e6469636174652f656e6c6973743a20436f756c64206e6f74207472616e736665722044616920616d6f756e742066726f6d2063616c6c65722e4461694261636b73746f7053796e6469636174652f656e74657241756374696f6e3a2041756374696f6e20616c72656164792066696e616c697a65644461694261636b73746f7053796e6469636174652f656e6c6973743a2043616e6e6f74206465706f736974206f6e6365207468652066697273742061756374696f6e2062696420686173206265656e206d6164652e536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f7745524332303a206275726e2066726f6d20746865207a65726f206164647265737345524332303a207472616e736665722066726f6d20746865207a65726f206164647265737345524332303a20617070726f76652066726f6d20746865207a65726f2061646472657373a265627a7a723158203eec37919e161e97bce78aff18aba0a613d1045e6b79f8eb3715c244456e64d064736f6c63430005100032";