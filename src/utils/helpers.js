import { BigNumber } from "ethers"
import { API_BASE_URI, BLOCK_EXPLORER_URL } from "./constants"
import { commify, formatUnits } from "ethers/lib/utils"

const toBN = (value) => BigNumber.from(value)
const getBlockTimestamp = () => Math.floor((new Date()).getTime() / 1000.0)
const toImgUrl = (url) => `${API_BASE_URI}/${url}`
const toRawUrl = (itemId) => `${API_BASE_URI}/items/raw/${itemId}`
const toTxUrl = (tx) => BLOCK_EXPLORER_URL + '/tx/' + tx
const toAddressUrl = (address) => BLOCK_EXPLORER_URL + '/address/' + address
const formatHexString = (hexString, start = 3, end = 3) => hexString.substring(0, start) + '...' + hexString.substring(hexString.length - end)
const toTokenId = (itemId) => itemId.substring(43)
const toTokenAddress = (itemId) => itemId.substring(0, 42)
const formatPrice = (price) => commify(Number(formatUnits(price, '18')))
const timestampToDate = (timestamp) => new Date(timestamp)
    .toLocaleString('en-GB', { hour12: false, })
    .replace(',', ' -')

export {
    toBN,
    getBlockTimestamp,
    toImgUrl,
    toRawUrl,
    toTxUrl,
    toAddressUrl,
    formatHexString,
    toTokenId,
    toTokenAddress,
    timestampToDate,
    formatPrice,
}