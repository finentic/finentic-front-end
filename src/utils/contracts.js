import { Contract } from 'ethers'
import ControlCenter from '../contracts/access/ControlCenter.json'
import Marketplace from '../contracts/marketplace/Marketplace.json'
import Collection from '../contracts/nft/Collection.json'
import CollectionFactory from '../contracts/nft/CollectionFactory.json'
import Shared from '../contracts/nft/Shared.json'
import VietnameseDong from '../contracts/payment/VietnameseDong.json'

const CONTROL_CENTER_ADDRESS = process.env.REACT_APP_CONTROL_CENTER_ADDRESS
const VIETNAMESE_DONG_ADDRESS = process.env.REACT_APP_VIETNAMESE_DONG_ADDRESS
const SHARED_ADDRESS = process.env.REACT_APP_SHARED_ADDRESS
const COLLECTION_ADDRESS = process.env.REACT_APP_COLLECTION_ADDRESS
const COLLECTION_FACTORY_ADDRESS = process.env.REACT_APP_COLLECTION_FACTORY_ADDRESS
const TREASURY_ADDRESS = process.env.REACT_APP_TREASURY_ADDRESS
const MARKETPLACE_ADDRESS = process.env.REACT_APP_MARKETPLACE_ADDRESS


const controlCenterContract = provider => new Contract(CONTROL_CENTER_ADDRESS, ControlCenter.abi, provider)
const marketplaceContract = provider => new Contract(MARKETPLACE_ADDRESS, Marketplace.abi, provider)
const sharedContract = provider => new Contract(SHARED_ADDRESS, Shared.abi, provider)
const collectionFactoryContract = provider => new Contract(COLLECTION_FACTORY_ADDRESS, CollectionFactory.abi, provider)

export {
    ControlCenter,
    Marketplace,
    Collection,
    CollectionFactory,
    Shared,
    VietnameseDong,
    CONTROL_CENTER_ADDRESS,
    VIETNAMESE_DONG_ADDRESS,
    SHARED_ADDRESS,
    COLLECTION_ADDRESS,
    COLLECTION_FACTORY_ADDRESS,
    TREASURY_ADDRESS,
    MARKETPLACE_ADDRESS,
    collectionFactoryContract,
    controlCenterContract,
    marketplaceContract,
    sharedContract,
}