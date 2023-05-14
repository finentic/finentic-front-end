import { useEffect, useRef, useState } from "react"
import { ButtonSubmit, TimeCountdown } from "../../components"
import {
    BUTTON_STATE,
    ITEM_STATE,
    LISTING_STATE,
    MARKETPLACE_ADDRESS,
    SHARED_ADDRESS,
    formatPrice,
    toTokenId,
    timestampToDate,
    toBN,
    getBlockTimestamp,
} from "../../utils"
import { commify, parseUnits } from "ethers/lib/utils"
import { faBriefcaseClock, faTag } from "@fortawesome/free-solid-svg-icons"
import { Dropdown, DropdownButton, Form, InputGroup } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


const BUTTON_TITLE = {
    'BUY_NOW': 'Buy now',
    'START_SOON': 'Preparing',
    'ACTIVE': 'Place bid',
    'ENDED': 'Ended',
}

const LISTING_TITLE = {
    'BUY_NOW': 'Buy now',
    'START_SOON': 'Auction will start soon',
    'ACTIVE': 'Auction active',
    'ENDED': 'Auction has ended',
}


function Trading({ item, eth, isOwner }) {
    const ref = useRef(null)
    const [buttonState, setButtonState] = useState(BUTTON_STATE.ENABLE)
    const [cursor, setCursor] = useState(0)
    const [auctionForm, setAuctionForm] = useState({
        price: formatPrice(item.price || '0'),
    })

    useEffect(() => {
        const input = ref.current
        if (input) input.setSelectionRange(cursor, cursor)
    }, [ref, cursor, auctionForm.price])

    const now = new Date().getTime()
    const startTime = Number(item.start_time + '000')
    const endTime = Number(item.end_time + '000')

    const getListingState = () => {
        if (!item.start_time) return LISTING_STATE.BUY_NOW
        if (now < startTime) return LISTING_STATE.START_SOON
        if (now > startTime && now < endTime) return LISTING_STATE.ACTIVE
        if (now > endTime) return LISTING_STATE.ENDED
    }

    const isWinner = getListingState() === LISTING_STATE.ENDED && item.price_history[0].account._id === eth.account._id.toLowerCase()

    const resetState = () => setButtonState(BUTTON_STATE.ENABLE)

    const handleInputChange = event => {
        const target = event.target
        let value = target.value
        const name = target.name
        // validate price input
        if (name === 'price') {
            if (!value || Number(value) < 1) value = '0'
            const price = value.replaceAll(',', '')
            if (!/^[0-9]+$/.test(price)) return;
            value = commify(price)
            const offsetValue = (value.length - 1 - auctionForm.price.length)
            const offsetCursor = (offsetValue < -2) ? -1 : 0
            setCursor(event.target.selectionStart + (offsetValue < 0 ? offsetCursor : offsetValue))
        }
        setAuctionForm({ ...auctionForm, [name]: value })
    }

    const handlePlaceBid = async event => {
        event.preventDefault()
        setButtonState(BUTTON_STATE.PENDING)
        try {
            if (isWinner) {
                await eth.MarketplaceContract.paymentProcessingItemAuction(
                    SHARED_ADDRESS,
                    toTokenId(item._id),
                )
                eth.MarketplaceContract.on(
                    'Invoice',
                    async (_buyer, _seller, nftContract, tokenId) => (
                        nftContract.toLowerCase() === SHARED_ADDRESS.toLowerCase() &&
                        tokenId.toString() === toTokenId(item._id)
                    ) && resetState()
                )
            } else {
                const bid = parseUnits(auctionForm.price.replaceAll(',', ''), '18')
                const isEnoughAllowance = await eth.VietnameseDong.allowance(eth.account._id, MARKETPLACE_ADDRESS)
                if (isEnoughAllowance.lt(bid)) {
                    await eth.VietnameseDong.approve(MARKETPLACE_ADDRESS, bid)
                    eth.VietnameseDong.on('Approval', async (owner) => (owner.toLowerCase() === eth.account._id) && setButtonState(BUTTON_STATE.DONE))
                }
                await eth.MarketplaceContract.biddingForAuction(
                    SHARED_ADDRESS,
                    toTokenId(item._id),
                    bid,
                )
                eth.MarketplaceContract.on(
                    'BiddingForAuction',
                    async (nftContract, tokenId) => (
                        nftContract.toLowerCase() === SHARED_ADDRESS.toLowerCase() &&
                        tokenId.toString() === toTokenId(item._id)
                    ) && resetState()
                )
            }
        } catch (error) {
            console.error(error)
            setButtonState(BUTTON_STATE.REJECTED)
        }
    }

    const handleBuyNow = async event => {
        event.preventDefault()
        event.preventDefault()
        setButtonState(BUTTON_STATE.PENDING)
        try {
            const price = parseUnits(item.price, '0')
            const isEnoughAllowance = await eth.VietnameseDong.allowance(eth.account._id, MARKETPLACE_ADDRESS)
            if (isEnoughAllowance.lt(price)) {
                await eth.VietnameseDong.approve(MARKETPLACE_ADDRESS, price)
                eth.VietnameseDong.on(
                    'Approval',
                    async (owner) => (owner.toLowerCase() === eth.account._id) && setButtonState(BUTTON_STATE.DONE)
                )
            } else {
                await eth.MarketplaceContract.buyNow(
                    SHARED_ADDRESS,
                    toTokenId(item._id),
                )
                eth.MarketplaceContract.on(
                    'RemoveItemForBuyNow',
                    async (nftContract, tokenId) => (
                        nftContract.toLowerCase() === SHARED_ADDRESS.toLowerCase() &&
                        tokenId.toString() === toTokenId(item._id)
                    ) && resetState()
                )
            }
        } catch (error) {
            console.error(error)
            setButtonState(BUTTON_STATE.REJECTED)
        }
    }

    if (item.state === ITEM_STATE.LISTING) return (
        <div className="card rounded-3">
            <div className="card-header py-3">
                <div className='fw-bold float-start'>
                    <FontAwesomeIcon icon={item.start_time ? faBriefcaseClock : faTag} className="me-2" />
                    {LISTING_TITLE[getListingState()]}
                </div>
                <div className='float-end'>
                    {(getListingState() === LISTING_STATE.START_SOON) && (<>
                        Start in: <TimeCountdown timeRemaining={Number(item.start_time) - getBlockTimestamp()} className='text-primary' />
                    </>)}

                    {(getListingState() === LISTING_STATE.ACTIVE) && (<>
                        End in: <TimeCountdown timeRemaining={Number(item.end_time) - getBlockTimestamp()} className='text-danger' />
                    </>)}
                </div>
            </div>
            <div className="card-body">
                <form onSubmit={(!item.start_time) ? handleBuyNow : handlePlaceBid}>
                    <div className='col'>
                        <p>
                            {item.start_time ? 'Top bid' : 'Price'}: <br />
                            <span className='fs-4 fw-bold'>
                                {(formatPrice(item.price) + ' VND')}
                            </span>
                        </p>
                    </div>

                    <div hidden={isOwner}>
                        {(getListingState() === LISTING_STATE.ACTIVE) && (
                            <div className='form-group py-3'>
                                <span className='fw-bold fs-5'>
                                    Place a bid
                                </span>
                                <br />
                                <small className='text-muted'>
                                    Require higher than top bid.
                                </small>
                                <InputGroup className="pb-2">
                                    <Form.Control
                                        id='price'
                                        name='price'
                                        size='lg'
                                        type='text'
                                        value={auctionForm.price}
                                        onChange={handleInputChange}
                                        disabled={isOwner}
                                        readOnly={isOwner}
                                        ref={ref}
                                    />
                                    <DropdownButton
                                        variant="outline-secondary"
                                        title="VND"
                                        id="currency"
                                        align="end"
                                        disabled
                                    >
                                        <Dropdown.Item href="#">VND - Vietnamese Dong</Dropdown.Item>
                                    </DropdownButton>
                                </InputGroup>
                            </div>
                        )}
                        <ButtonSubmit
                            buttonState={(
                                getListingState() === LISTING_STATE.BUY_NOW || isWinner || (
                                    getListingState() === LISTING_STATE.ACTIVE && (
                                        toBN(
                                            formatPrice(item.price).replaceAll(',', '')
                                        ).lt(
                                            toBN(auctionForm.price.replaceAll(',', ''))
                                        )
                                    )
                                )
                            ) ? buttonState : BUTTON_STATE.DISABLE}
                            resetState={resetState}
                            title={isWinner ? "Claim" : BUTTON_TITLE[getListingState()]}
                        />
                    </div>
                </form>
            </div>

            {(item.start_time && (
                <div className="card-footer">
                    <div className='row text-center text-secondary fw-bold'>
                        <div className='col col-12 col-md-6'>
                            Start: {timestampToDate(Number(item.start_time + '000'))}
                        </div>
                        <div className='col col-12 col-md-6'>
                            End: {timestampToDate(Number(item.end_time + '000'))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )

    return null
}

export default Trading