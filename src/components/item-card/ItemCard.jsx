import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toImgUrl, formatPrice, ITEM_STATE, getBlockTimestamp } from '../../utils'
import { ButtonImg } from '../button-img'
import { TimeCountdown } from '../time-countdown'

const LISTING_STATE = {
    'BUY_NOW': 'BUY_NOW',
    'START_SOON': 'START_SOON',
    'ACTIVE': 'ACTIVE',
    'ENDED': 'ENDED',
}

function ItemCard({ item }) {
    const navigate = useNavigate()
    const [show, setShow] = useState(0)
    const handleOnMouseEnter = () => {
        setShow(1)
    }
    const handleOnMouseLeave = () => {
        setShow(0)
    }
    const handleOnClick = () => {
        navigate(`/item/${item._id}`)
    }

    const now = new Date().getTime()
    const startTime = Number(item.start_time + '000')
    const endTime = Number(item.end_time + '000')

    const getListingState = () => {
        if (!item.start_time) return LISTING_STATE.BUY_NOW
        if (now < startTime) return LISTING_STATE.START_SOON
        if (now > startTime && now < endTime) return LISTING_STATE.ACTIVE
        if (now > endTime) return LISTING_STATE.ENDED
    }

    const listingState = getListingState()

    if (!item.from_collection) return null

    return (
        <div className='col-12 col-sm-6 col-lg-4 col-xl-3 mb-4'        >
            <div className='card rounded-3 shadow-sm shadow-hover cursor-pointer' onClick={handleOnClick}>
                <div
                    onMouseEnter={handleOnMouseEnter}
                    onMouseLeave={handleOnMouseLeave}
                    className="rounded-3"
                >
                    <div
                        className="h-100 w-100"
                        style={{
                            backgroundImage: `url("${toImgUrl(item.thumbnail)}")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            borderRadius: 'var(--bs-border-radius) var(--bs-border-radius) 0px 0px',
                        }}
                    >
                        <img
                            src={toImgUrl(item.thumbnail)}
                            className="w-100"
                            draggable="false"
                            style={{
                                backdropFilter: "blur(4px) brightness(90%)",
                                objectFit: 'contain',
                                height: '250px',
                                borderRadius: 'var(--bs-border-radius) var(--bs-border-radius) 0px 0px',
                            }}
                            alt={item.name}
                        />
                    </div>

                    <div
                        className="w-100"
                        style={{
                            backgroundColor: '#0008',
                            position: 'absolute',
                            zIndex: 1,
                            top: 0,
                            left: 0,
                            height: '250px',
                            borderRadius: 'var(--bs-border-radius) var(--bs-border-radius) 0px 0px',
                            opacity: show,
                            transition: 'opacity 0.2s linear',
                        }}>
                        <div>
                            <div className='p-2'>
                                <ButtonImg
                                    imgUrl={toImgUrl(item.from_collection.thumbnail)}
                                    title={item.from_collection.name}
                                    tooltip={item.from_collection.name + ' Collection'}
                                    className='bg-light-50'
                                    onClick={event => {
                                        event.stopPropagation()
                                        navigate(`/collection/${item.from_collection._id}`)
                                    }}
                                />
                                <div
                                    style={{ position: 'absolute', bottom: 0 }}
                                    className="h5 text-light fw-bold"
                                >
                                    {item.name}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-body p-2">
                    {(item.state !== ITEM_STATE.LISTING) && <p className='card-text fs-6'>
                        <span className='text-secondary'>
                            Available
                        </span>
                        <br />
                        Not for sale
                    </p>}

                    {(item.state === ITEM_STATE.LISTING) && <p className="card-text fs-6">
                        <span className='text-secondary'>
                            {(listingState === LISTING_STATE.START_SOON) && (<>
                                Start in: <TimeCountdown timeRemaining={Number(item.start_time) - getBlockTimestamp()} className='text-primary' />
                            </>)}

                            {(listingState === LISTING_STATE.ACTIVE) && (<>
                                End in: <TimeCountdown timeRemaining={Number(item.end_time) - getBlockTimestamp()} className='text-danger' />
                            </>)}

                            {(listingState === LISTING_STATE.ENDED) && (<>
                                Auction ended
                            </>)}

                            {(listingState === LISTING_STATE.BUY_NOW) && (<>
                                Buy now
                            </>)}
                        </span>
                        <br />
                        {formatPrice(item.price) + ' VND'}
                    </p>
                    }
                </div>
            </div>
        </div >
    )
}

export { ItemCard };