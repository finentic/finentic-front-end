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
const timestampToDate = (timestamp) => {
    const date = new Date(timestamp).toLocaleString(undefined, {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).replace(',', ' - ')
    return date.substring(3, 6) + date.substring(0, 2) + date.substring(5) 
}

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