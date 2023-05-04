import { BigNumber } from "ethers"
import { API_BASE_URI } from "./constants"

const toBN = (value) => BigNumber.from(value)
const getBlockTimestamp = () => Math.floor((new Date()).getTime() / 1000.0)
const toImgUrl = (url) => `${API_BASE_URI}/${url}`
const toRawUrl = (itemId) => `${API_BASE_URI}/items/raw/${itemId}`

export {
    toBN,
    getBlockTimestamp,
    toImgUrl,
    toRawUrl,
}