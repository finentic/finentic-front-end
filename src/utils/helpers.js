import { BigNumber } from "ethers"
import { API_BASE_URI } from "./constants"
import { commify, formatUnits } from "ethers/lib/utils"

const toBN = (value) => BigNumber.from(value)
const getBlockTimestamp = () => Math.floor((new Date()).getTime() / 1000.0)
const toImgUrl = (url) => `${API_BASE_URI}/${url}`
const toRawUrl = (itemId) => `${API_BASE_URI}/items/raw/${itemId}`
const getTokenIdFromItemId = (itemId) => itemId.substring(43)
const timestampToDate = (timestamp) => new Date(Number(timestamp + '000')).toLocaleString().replace(',', ' - ')
const formatPrice = (price) => commify(Number(formatUnits(price, '18')))

export {
    toBN,
    getBlockTimestamp,
    toImgUrl,
    toRawUrl,
    getTokenIdFromItemId,
    timestampToDate,
    formatPrice,
}