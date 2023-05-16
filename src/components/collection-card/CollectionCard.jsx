import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toImgUrl, formatPrice, ITEM_STATE, ACCOUNT_STATE, getBlockTimestamp } from '../../utils'
import { ButtonImg } from '../button-img'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { TimeCountdown } from '../time-countdown'
import { ROUTERS_PATH } from '../../routers/MainRoutes'

const LISTING_STATE = {
    'BUY_NOW': 'BUY_NOW',
    'START_SOON': 'START_SOON',
    'ACTIVE': 'ACTIVE',
    'ENDED': 'ENDED',
}

function CollectionCard({ collection }) {
    const navigate = useNavigate()
    const [show, setShow] = useState(0)
    const handleOnMouseEnter = () => {
        setShow(1)
    }
    const handleOnMouseLeave = () => {
        setShow(0)
    }
    const handleOnClick = () => {
        navigate(`${ROUTERS_PATH.collection}${collection._id}`)
    }

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
                            backgroundImage: `url("${toImgUrl(collection.thumbnail)}")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            borderRadius: 'var(--bs-border-radius) var(--bs-border-radius) 0px 0px',
                        }}
                    >
                        <img
                            src={toImgUrl(collection.thumbnail)}
                            className="w-100"
                            draggable="false"
                            style={{
                                backdropFilter: "blur(4px) brightness(90%)",
                                objectFit: 'contain',
                                height: '250px',
                                borderRadius: 'var(--bs-border-radius) var(--bs-border-radius) 0px 0px',
                            }}
                            alt={collection.name}
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
                                    imgUrl={toImgUrl(collection.creator.thumbnail)}
                                    title={<>
                                        {collection.creator.name} {(collection.creator.status === ACCOUNT_STATE.VERIFIED) && <FontAwesomeIcon
                                            icon={faCircleCheck}
                                            className='text-primary ps-1 pt-1'
                                        />}
                                    </>}
                                    className='bg-light-50'
                                    onClick={event => {
                                        event.stopPropagation()
                                        navigate(`/account/${collection.creator._id}`)
                                    }}
                                />
                                <div
                                    style={{ position: 'absolute', bottom: 0 }}
                                    className="h5 text-light fw-bold"
                                >
                                    {collection.name}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-body p-2">
                    <p className='card-text fs-6 pt-2'>
                        <span className='text-secondary fw-bold'>
                            {collection.name}
                        </span>
                        <br />
                        {collection.symbol}
                    </p>
                </div>
            </div>
        </div >
    )
}

export { CollectionCard };