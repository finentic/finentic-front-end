import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toImgUrl, formatPrice, ITEM_STATE } from '../../utils'
import { ButtonImg } from '../button-img'


function ItemCard({ item }) {
    const navigate = useNavigate()
    const [show, setShow] = useState(0)
    const handleOnMouseEnter = () => {
        setShow(1)
    }
    const handleOnMouseLeave = () => {
        setShow(0)
    }
    const handleOnClick = (event) => {
        navigate(`/item/${item._id}`)
    }
    return (
        <div
            className='col-12 col-sm-6 col-lg-4 col-xl-3 mb-4'
            onClick={handleOnClick}
        >
            <div className='card rounded-3 shadow-sm shadow-hover'>
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
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                    }}
                                    className="h5 text-nowrap text-light fw-bold"
                                >
                                    {item.name}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-body p-2">
                    <ButtonImg
                        imgUrl={toImgUrl(item.owner.thumbnail)}
                        title={item.owner.name}
                        size={20}
                        className='bg-light-50'
                        onClick={event => {
                            event.stopPropagation()
                            navigate(`/account/${item.owner._id}`)
                        }}
                    />
                    <p className="card-text fs-5 pt-2">
                        {(item.state === ITEM_STATE.LISTING)
                            ? (formatPrice(item.price) + ' VND')
                            : <span className='text-secondary fs-6'>Not listing yet</span>
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}

export { ItemCard };