import { ACCOUNT_STATE, getBlockTimestamp, toImgUrl } from "../../utils"
import { ButtonImg, TimeCountdown } from "../../components"
import { useState } from "react"
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const ListingPreview = ({ listingForm, item }) => {
    const [show, setShow] = useState(0)
    const handleOnMouseEnter = () => {
        setShow(1)
    }
    const handleOnMouseLeave = () => {
        setShow(0)
    }

    const now = getBlockTimestamp()
    const startTime = new Date(listingForm.startTime).getTime() / 1000

    return (
        <div className='card rounded-3 shadow-sm shadow-hover w-25' style={{ position: 'fixed', minWidth: '250px', maxWidth: '560px' }}>
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
                <p className="card-text fs-6 pt-2">
                    <span className='text-secondary'>
                        {(listingForm.method === 'fixed')
                            ? (<>
                                Buy now
                            </>)
                            : (<>
                                Start in: <TimeCountdown timeRemaining={startTime - now} className='text-primary' />
                            </>)
                        }
                    </span>
                    <br />
                    {listingForm.price
                        ? <>{(listingForm.price) + ' VND'}</>
                        : <p className='card-text fs-6 pt-2'>
                            <span className='text-secondary'>
                                Available
                            </span>
                            <br />
                            Not for sale
                        </p>
                    }
                </p>
            </div>

        </div>
    )
}

export default ListingPreview