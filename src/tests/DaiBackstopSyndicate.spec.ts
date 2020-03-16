import * as ethers from 'ethers'

import { 
  AbstractContract, 
  expect,
  RevertError,
  ZERO_ADDRESS,
  decimals
} from './utils'

import * as utils from './utils'
import { Dai } from 'typings/contracts/Dai'
import { DSToken } from 'typings/contracts/DSToken'
import { Vat } from 'typings/contracts/Vat'
import { Flopper } from 'typings/contracts/Flopper'
import { DaiJoin } from 'typings/contracts/DaiJoin'
import { MkrAuthority } from 'typings/contracts/MkrAuthority'
import { DaiBackstopSyndicate } from 'typings/contracts/DaiBackstopSyndicate'
import { BigNumber } from 'ethers/utils';
import { Zero } from 'ethers/constants'

// init test wallets from package.json mnemonic
const web3 = (global as any).web3

const {
  wallet: ownerWallet,
  provider: ownerProvider,
  signer: ownerSigner
} = utils.createTestWallet(web3, 0)

const {
  wallet: userWallet,
  provider: userProvider,
  signer: userSigner
} = utils.createTestWallet(web3, 2)

const {
  wallet: operatorWallet,
  provider: operatorProvider,
  signer: operatorSigner
} = utils.createTestWallet(web3, 4)

const {
  wallet: randomWallet,
  provider: randomProvider,
  signer: randomSigner
} = utils.createTestWallet(web3, 5)

const getBig = (id: number) => new BigNumber(id);

contract('DaiBackstopSyndicate', (accounts: string[]) => {
  let ownerAddress: string
  let userAddress: string

  // Dai
  let daiAbstract: AbstractContract
  let daiOwnerContract: Dai
  let daiConstract: Dai
  let daiAddress: string

  // MKR
  let mkrAbstract: AbstractContract
  let mkrOwnerContract: DSToken
  let mkrConstract: DSToken
  let mkrAddress: string

  // Authority
  let authAbstract: AbstractContract
  let authOwnerContract: MkrAuthority
  let authConstract: MkrAuthority
  let authAddress: string

  // VAT
  let vatAbstract: AbstractContract
  let vatOwnerContract: Vat
  let vatConstract: Vat
  let vatAddress: string

  // VAT
  let daiJoinAbstract: AbstractContract
  let daiJoinOwnerContract: DaiJoin
  let daiJoinConstract: DaiJoin
  let daiJoinAddress: string

  // Flopper
  let flopAbstract: AbstractContract
  let flopOwnerContract: Flopper
  let flopConstract: Flopper
  let flopAddress: string

  // Syndicate
  let syndicateAbstract: AbstractContract
  let syndicateOwnerContract: DaiBackstopSyndicate
  let syndicateConstract: DaiBackstopSyndicate
  let syndicateAddress: string

  // Parameters
  let AUCTION_START_TIME: number = 1584490000
  let user_dai_balance: BigNumber = new BigNumber(50000).mul(decimals)
  let enlist_amount: BigNumber = new BigNumber(1000).mul(decimals) 

  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    userAddress = await userWallet.getAddress()
    daiAbstract = await AbstractContract.fromArtifactName('Dai')
    mkrAbstract = await AbstractContract.fromArtifactName('DSToken')
    authAbstract = await AbstractContract.fromArtifactName('MkrAuthority')
    vatAbstract = await AbstractContract.fromArtifactName('Vat')
    daiJoinAbstract = await AbstractContract.fromArtifactName('DaiJoin')
    flopAbstract = await AbstractContract.fromArtifactName('Flopper')
    syndicateAbstract = await AbstractContract.fromArtifactName('DaiBackstopSyndicate')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {
    // Deploy DAI
    daiOwnerContract = await daiAbstract.deploy(ownerWallet, [1]) as Dai
    daiConstract = await daiOwnerContract.connect(userSigner) as Dai
    daiAddress = daiOwnerContract.address

    // Deploy Authority
    authOwnerContract = await authAbstract.deploy(ownerWallet) as MkrAuthority
    authConstract = await authOwnerContract.connect(userSigner) as MkrAuthority
    authAddress = authOwnerContract.address

    // Deploy MKR
    let sym = ethers.utils.formatBytes32String("MKR") 
    mkrOwnerContract = await mkrAbstract.deploy(ownerWallet, [sym]) as DSToken
    mkrConstract = await mkrOwnerContract.connect(userSigner) as DSToken
    mkrAddress = mkrOwnerContract.address

    // Deploy VAT
    vatOwnerContract = await vatAbstract.deploy(ownerWallet) as Vat
    vatConstract = await vatOwnerContract.connect(userSigner) as Vat
    vatAddress = vatOwnerContract.address

    // Deploy Flopper
    flopOwnerContract = await flopAbstract.deploy(ownerWallet, [vatAddress, mkrAddress]) as Flopper
    flopConstract = await flopOwnerContract.connect(userSigner) as Flopper
    flopAddress = flopOwnerContract.address

    // Deploy DaiJoin
    daiJoinOwnerContract = await daiJoinAbstract.deploy(ownerWallet, [
      vatAddress, 
      daiAddress
    ]) as DaiJoin
    daiJoinConstract = await daiJoinOwnerContract.connect(userSigner) as DaiJoin
    daiJoinAddress = daiJoinOwnerContract.address

    // Deploy Syndicate
    syndicateOwnerContract = await syndicateAbstract.deploy(ownerWallet, [
      daiAddress,
      mkrAddress,
      daiJoinAddress,
      vatAddress
    ]) as DaiBackstopSyndicate
    syndicateConstract = await syndicateOwnerContract.connect(userSigner) as DaiBackstopSyndicate
    syndicateAddress = syndicateOwnerContract.address
    
    // Set Authorities contract
    await mkrOwnerContract.functions.setAuthority(authAddress)
    await authOwnerContract.functions.rely(flopAddress)

    // Mint some DAI to users
    await daiOwnerContract.functions.mint(userAddress, user_dai_balance)

    // Set user DAI approvals for transfers
    await daiConstract.functions.approve(syndicateAddress, user_dai_balance)
  })

  describe('enlist() function', () => {
    it('should PASS if user has enough DAI', async () => {
      const tx = syndicateConstract.functions.enlist(enlist_amount)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if user does not have enough dai', async () => {
      let balance = await daiConstract.functions.balanceOf(userAddress)
      expect(balance).to.be.eql(user_dai_balance)
      const tx = syndicateConstract.functions.enlist(user_dai_balance.add(1))
      await expect(tx).to.be.rejectedWith(RevertError("Dai/insufficient-balance"))
    })

    context('When user enlisted', () => {
      let tx;
      beforeEach(async () => {
        tx = await syndicateConstract.functions.enlist(enlist_amount)
      })

      it('should mint syndicate shares', async () => {
        let balance = await syndicateConstract.functions.balanceOf(userAddress)
        expect(balance).to.be.eql(enlist_amount)
      })
    })
  })
})